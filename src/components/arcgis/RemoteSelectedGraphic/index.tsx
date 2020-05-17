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
import GraphicsLayer from "esri/layers/GraphicsLayer";
import Graphic from "esri/Graphic";
import {esri} from "../../../utils/ArcGisLoader";
import Polygon from "esri/geometry/Polygon";
import MapView from "esri/views/MapView";
import Geometry from "esri/geometry/Geometry";

export interface IRemoteSelectedGraphicProps {
  mapView: MapView;
  layer: GraphicsLayer;
  graphic: Graphic;
  color: { r: number, g: number, b: number };
}

function translatePoint(view: MapView, p: Polygon, point: number, dx: number, dy: number): void {
  const currentPoint = p.getPoint(0, point);
  const sp  = view.toScreen(currentPoint);
  const newPoint = view.toMap({x: sp.x + dx, y: sp.y + dy});
  p.setPoint(0, point, newPoint);
}

function createOutline(graphic: Graphic, delta: number, mapView: MapView): Geometry {
  const geometry = esri.geometry.Polygon.fromExtent(graphic.geometry.extent);

  translatePoint(mapView, geometry, 0, -delta, delta);
  translatePoint(mapView, geometry, 1, -delta, -delta);
  translatePoint(mapView, geometry, 2, delta, -delta);
  translatePoint(mapView, geometry, 3, delta, delta);
  translatePoint(mapView, geometry, 4, -delta, delta);

  return geometry;
}

export const RemoteSelectedGraphic = (props: IRemoteSelectedGraphicProps) => {
  const {layer, graphic, color, mapView} = props;

  useEffect(() => {
    let selectionGraphic: Graphic | null = null;
    let geometryHandle: any;
    let zoomHandle: any;

    if (graphic.geometry.extent !== null) {
      const geometry = createOutline(graphic, 5, mapView);

      const symbol = {
        type: "simple-fill",
        color: [color.r, color.g, color.b, 0.1],
        outline: {
          type: "simple-line",
          color: [color.r, color.g, color.b],
          width: 1,
          style: "short-dot"
        }
      };

      selectionGraphic = new esri.Graphic({geometry, symbol});
      layer.add(selectionGraphic);

      geometryHandle = esri.core.watchUtils.watch(graphic, "geometry", () => {
        if (selectionGraphic) {
          selectionGraphic.geometry = createOutline(graphic, 5, mapView);
        }
      });

      zoomHandle = esri.core.watchUtils.watch(props.mapView, "zoom", () => {
        if (selectionGraphic) {
          selectionGraphic.geometry = createOutline(graphic, 5, mapView);
        }
      });
    }

    return () => {
      if (selectionGraphic) {
        layer.remove(selectionGraphic);
      }
      if (geometryHandle) {
        geometryHandle.remove();
      }

      if (zoomHandle) {
        zoomHandle.remove();
      }
    }
    // eslint-disable-next-line
  }, []);

  return null;
};
