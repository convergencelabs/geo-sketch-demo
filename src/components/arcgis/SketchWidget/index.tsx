/*
 * Copyright (c) 2020 Convergence Labs, Inc.
 *
 * This file is part of the Convergence Chat Demo, which is released under
 * the terms of the MIT License. A copy of the MIT should have been provided
 * along with this file, typically located in the "LICENSE" file, which is part
 * of this source code package. Alternatively, see
 * <https://opensource.org/licenses/MIT> for the full text of theMIT license,
 *  if it was not provided.
 */

import {useEffect} from 'react';
import MapView from "esri/views/MapView";
import {esri} from "../../../utils/ArcGisLoader";
import {useStores} from "../../../stores/stores";
import {IConvergenceEvent, ObjectSetEvent, RealTimeElement, RealTimeObject} from "@convergence/convergence";
import {GraphicAdapter} from "../../../utils/GraphicAdapter";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Graphic from "esri/Graphic"
import Sketch from "esri/widgets/Sketch";
import {createUUID} from "../../../utils/uuid";
import {reactColorToEsriColor} from "../../../utils/color-util";
import {rateLimitWithCancel} from "../../../utils/rateLimit";

export interface ISketchWidgetProps {
  view: MapView;
}

export const SketchWidget = (props: ISketchWidgetProps) => {
  const {modelStore, formattingStore, sketchStore} = useStores();
  const {view} = props;
  const {model} = modelStore;

  useEffect(() => {
    let layer: GraphicsLayer;
    let sketch: Sketch;
    if (model !== null && view) {
      layer = new esri.layers.GraphicsLayer();
      view.map.add(layer);

      sketch = new esri.widgets.Sketch({
        layer: layer,
        view: view,
        creationMode: "update"
      });

      view.ui.add(sketch, "top-right");

      const bindGraphic = (layer: GraphicsLayer, graphic: Graphic, id: string, rte: RealTimeObject) => {
        GraphicAdapter.bind({
          graphic,
          realTimeObject: rte,
          id,
          onTransform: (g) => {
            if (sketch.updateGraphics.includes(g) &&  (sketch.viewModel as any).activeComponent) {
              (sketch.viewModel as any).activeComponent.refresh();
            }
          },
          onVertexChange: (g) => {
            if (sketch.updateGraphics.includes(g) &&  (sketch.viewModel as any).activeComponent) {
              (sketch.viewModel as any).activeComponent.refresh();
            }
          },
          onRemove: (g) => {
            layer.remove(g);
            if (sketch.updateGraphics.includes(g)) {
              sketch.updateGraphics.remove(g);
              if (sketch.updateGraphics.length > 0  &&  (sketch.viewModel as any).activeComponent) {
                const activeComponent = (sketch.viewModel as any).activeComponent;
                activeComponent.graphics = (activeComponent.graphics as any[]).filter(a => a !== g);
                activeComponent.refresh();
              } else {
                sketch.cancel();
              }
            }
          }
        });
      };

      const addFeature = (feature: RealTimeObject, id: string, layer: GraphicsLayer) => {
        const graphic = esri.Graphic.fromJSON(feature.toJSON());
        bindGraphic(layer, graphic, id, feature);
        layer.add(graphic);
      };

      const [sendSketch, cancelSendSketch] = rateLimitWithCancel((sketchGeom) => {
        sketchStore.setLocalState(sketchGeom);
      }, 50);

      const features = model.elementAt("features") as RealTimeObject;

      features.forEach((f: RealTimeElement, id?: string) => {
        addFeature(f as RealTimeObject, id!, layer);
      });

      features.on(RealTimeObject.Events.SET, (e: IConvergenceEvent) => {
        const event = e as ObjectSetEvent;
        const rto = event.value as RealTimeObject;
        const p = rto.path();
        const id = p[p.length - 1] as string;
        addFeature(rto, id, layer);
      });

      sketch.on("create", e => {
        if (e.state === "complete" || e.state === "cancel") {
          cancelSendSketch();
          sketchStore.clearLocalState();
        }

        if (e.state === "complete") {
          const graphic = e.graphic;

          graphic.symbol.color = reactColorToEsriColor(formattingStore.fillColor);

          if ((graphic.symbol as any).outline !== undefined) {
            const outline = (graphic.symbol as any).outline;
            outline.color = reactColorToEsriColor(formattingStore.lineColor);
            outline.width = formattingStore.lineThickness;
          }

          const json = graphic.toJSON();
          delete json["popupTemplate"];
          json.attributes = {
            title: "",
            description: ""
          };
          const id = createUUID();
          const rte = features.set(id, json);

          bindGraphic(layer, graphic, id, rte as RealTimeObject);
        } else if (e.state === "active") {
          const sketchGeom = e.graphic.geometry.toJSON();
          sendSketch(sketchGeom);
        }
      });

      sketch.on("delete", e => {
        e.graphics.forEach(graphic => {
          GraphicAdapter.getAdapter(graphic).remove();
        });
      });

      sketch.on("undo", e => {
        if (e.tool === "move" || e.tool === "reshape" || e.tool === "transform") {
          e.graphics.forEach(g => {
            GraphicAdapter.getAdapter(g).setGeometry(g.geometry);
          });
        }
      });

      sketch.on("redo", e => {
        if (e.tool === "move" || e.tool === "reshape" || e.tool === "transform") {
          e.graphics.forEach(g => {
            GraphicAdapter.getAdapter(g).setGeometry(g.geometry);
          });
        }
      });

      sketch.on("update", e => {
        if (e.state === "active") {
          switch (e.toolEventInfo.type) {
            case "move":
            case "rotate":
            case "scale":
              e.graphics.forEach(g => {
                GraphicAdapter.getAdapter(g).setGeometry(g.geometry);
              });
              break;
            case "reshape": {
              // Note you can only reshape one graphic at a time.
              const mover = (e.toolEventInfo as any).mover;
              const pathIndex = mover.attributes.pathIndex;
              const pointIndex = mover.attributes.pointIndex;
              const graphic = e.graphics[0];
              const g = graphic.geometry as any;
              const comp = (g.rings || g.paths) as number[][][];
              const point = comp[pathIndex][pointIndex];
              GraphicAdapter.getAdapter(graphic).updateVertex(pathIndex, pointIndex, {
                x: point[0],
                y: point[1]
              });
              break;
            }
            case "vertex-add": {
              // Note you can only add vertices to one graphic at a time.
              const vertices = e.toolEventInfo.vertices.map(vertex => {
                const coords = vertex.coordinates as any as number[];
                return {
                  segmentIndex: vertex.componentIndex,
                  pointIndex: vertex.vertexIndex,
                  point: {x: coords[0], y: coords[1]}}
              });

              GraphicAdapter.getAdapter(e.graphics[0]).addVertices(vertices);
              break;
            }
            case "vertex-remove": {
              // Note you can only remove vertices to one graphic at a time.
              const vertices = e.toolEventInfo.vertices.map(vertex => {
                return {segmentIndex: vertex.componentIndex, pointIndex: vertex.vertexIndex}
              });
              GraphicAdapter.getAdapter(e.graphics[0]).deleteVertices(vertices);
            }
          }
        }
      });

      sketch.updateGraphics.on("change", () => {
        const graphics = sketch.updateGraphics.toArray();
        formattingStore.setSelectedGraphics(graphics);
        const objects = graphics.map(g => GraphicAdapter.getAdapter(g).getRealTimeObject());
        modelStore.setLocalSelection(objects);
      });
    }

    return () => {
      if (view.map && layer) {
        view.map.remove(layer);
      }
      if (view.ui && sketch) {
        view.ui.remove(sketch);
      }
    }
    // eslint-disable-next-line
  }, [view]);

  return null;
};
