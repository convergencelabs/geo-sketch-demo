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

import {
  ArrayInsertEvent,
  ArrayRemoveEvent,
  ArraySetValueEvent,
  IConvergenceEvent,
  ModelChangedEvent,
  NumberSetValueEvent,
  RealTimeArray,
  RealTimeNumber,
  RealTimeObject
} from "@convergence/convergence";
import {esri} from "./ArcGisLoader";
import Graphic from "esri/Graphic";
import Geometry from "esri/geometry/Geometry";
import Point from "esri/geometry/Point";
import Polygon from "esri/geometry/Polygon";
import Polyline from "esri/geometry/Polyline";
import SimpleFillSymbol from "esri/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "esri/symbols/SimpleLineSymbol";
import Symbol from "esri/symbols/Symbol";
import {RGBColor} from "react-color";

export interface GraphicAdapterOptions {
  graphic: any;
  id: string;
  realTimeObject: RealTimeObject;
  onTransform: (graphic: any) => void;
  onVertexChange: (graphic: any) => void;
  onRemove: (graphic: any) => void;
}

const GEOMETRY = "geometry";
const SYMBOL = "symbol";

export class GraphicAdapter {
  public static bind(options: GraphicAdapterOptions): void {
    options.graphic.__convergenceAdapter = new GraphicAdapter(options);
    (options.realTimeObject as any).__convergenceAdapter = options.graphic.__convergenceAdapter;
  }

  public static getAdapter(graphic: Graphic): GraphicAdapter {
    return (graphic as any).__convergenceAdapter;
  }

  public static getAdapterFromRealTimeObject(rto: RealTimeObject): GraphicAdapter {
    return (rto as any).__convergenceAdapter;
  }

  private readonly _onTransform: (graphic: any) => void;
  private readonly _onVertexChange: (graphic: any) => void;

  private readonly _graphic: Graphic;
  private readonly _rtGraphic: RealTimeObject;

  private _rtGeometry: RealTimeObject;

  private readonly _lineSymbol: SimpleLineSymbol;
  private readonly _rtLineSymbol: RealTimeObject;

  private readonly _fillSymbol: SimpleFillSymbol | null;
  private readonly _rtFillSymbol: RealTimeObject | undefined;

  private readonly _segmentKey: "paths" | "rings" | null;

  private readonly _id: string;

  constructor(options: GraphicAdapterOptions) {
    this._id = options.id;
    this._graphic = options.graphic;
    this._rtGraphic = options.realTimeObject;

    this._onTransform = options.onTransform;
    this._onVertexChange = options.onVertexChange;

    if ((this._graphic.symbol as any).outline) {
      this._fillSymbol = this._graphic.symbol as SimpleFillSymbol;
      this._rtFillSymbol = this._rtGraphic.get(SYMBOL) as RealTimeObject;
      this._bindSymbol(this._fillSymbol, this._rtFillSymbol);

      this._lineSymbol = this._fillSymbol.outline ;
      this._rtLineSymbol = this._rtGraphic.elementAt([SYMBOL, "outline"]) as RealTimeObject;
      this._bindSymbol(this._lineSymbol, this._rtLineSymbol);
    } else {
      this._fillSymbol = null;
      this._lineSymbol = this._graphic.symbol as SimpleLineSymbol;
      this._rtLineSymbol = this._rtGraphic.get(SYMBOL) as RealTimeObject;
      this._bindSymbol(this._lineSymbol, this._rtLineSymbol);
    }

    this._rtGraphic.on(RealTimeObject.Events.DETACHED, () => {
      options.onRemove(this._graphic);
    });

    this._rtGeometry = this._rtGraphic.get(GEOMETRY) as RealTimeObject;
    if (this._rtGeometry.hasKey("rings")) {
      this._segmentKey = "rings";
      this._bindToPoly("rings");
    } else if (this._rtGeometry.hasKey("paths")) {
      this._segmentKey = "paths";
      this._bindToPoly("paths");
    } else if (this._rtGeometry.hasKey("x")) {
      this._segmentKey  = null;
      this._bindToPoint();
    } else {
      throw Error();
    }
  }

  public id(): string {
    return this._id;
  }

  public getRealTimeObject(): RealTimeObject {
    return this._rtGraphic;
  }

  public getGraphic(): any {
    return this._graphic;
  }

  private _bindToPoint(): void {
    const x = this._rtGeometry.get("x") as RealTimeNumber;
    x.on(RealTimeNumber.Events.VALUE, () => {
      const geometry = this._graphic.geometry as Point;
      geometry.x = x.value();
    });

    const y = this._rtGeometry.get("y") as RealTimeNumber;
    y.on(RealTimeNumber.Events.VALUE, () => {
      const geometry = this._graphic.geometry as Point;
      geometry.y = y.value();
    });
  }

  private _bindToPoly(key: string): void {
    const segments = this._rtGeometry.get(key) as RealTimeArray;
    segments.on(RealTimeObject.Events.VALUE, () => {
      this._onTransform && this._onTransform(this._graphic);
      const newSegments = segments.toJSON();

      const curGeom = this._graphic.geometry.toJSON();
      curGeom[this._segmentKey as string] = newSegments;
      this._graphic.geometry = esri.geometry.support.jsonUtils.fromJSON(curGeom);
    });

    segments.on(RealTimeObject.Events.MODEL_CHANGED, (e: IConvergenceEvent) => {
      const modelChangedEvent = e as ModelChangedEvent;
      const event = modelChangedEvent.childEvent;
      if (modelChangedEvent.relativePath.length === 2 && event instanceof ArraySetValueEvent) {
        // vertex move
        const geometry = this._graphic.geometry as Polygon;
        const [segment, point] = modelChangedEvent.relativePath;
        const newVal = event.element.value();
        const newPoint = new esri.geometry.Point({x: newVal[0], y: newVal[1]});
        geometry.setPoint(segment as number, point as number, newPoint);
        this._graphic.geometry = esri.geometry.support.jsonUtils.fromJSON(geometry.toJSON());
      } else if (modelChangedEvent.relativePath.length === 1 && event instanceof ArrayInsertEvent) {
        // vertex added
        const geometry = this._graphic.geometry as Polygon;
        const segment = modelChangedEvent.relativePath[0];
        const newVal = event.value.value();
        const newPoint = new esri.geometry.Point({x: newVal[0], y: newVal[1]});
        geometry.insertPoint(segment as number, event.index, newPoint);
        this._graphic.geometry = esri.geometry.support.jsonUtils.fromJSON(geometry.toJSON());
      } else if (modelChangedEvent.relativePath.length === 1 && event instanceof ArrayRemoveEvent) {
        // vertex removed
        const geometry = this._graphic.geometry as Polygon;
        const segment = modelChangedEvent.relativePath[0];
        geometry.removePoint(segment as number, event.index);
        this._graphic.geometry = esri.geometry.support.jsonUtils.fromJSON(geometry.toJSON());
      }

      if (this._onVertexChange !== undefined) {
        this._onVertexChange(this._graphic);
      }
    });
  }

  public setFillColor(color: RGBColor): void {
    if (!this._fillSymbol || !this._rtFillSymbol) {
      throw new Error("This graphic does not have a fill symbol");
    }
    const rta = this._rtFillSymbol.get("color") as RealTimeArray;
    this._setColor(this._fillSymbol, rta, color);
  }

  public setLineColor(color: RGBColor): void {
    const rta = this._rtLineSymbol.get("color") as RealTimeArray;
    this._setColor(this._lineSymbol, rta, color);
  }

  public setLineThickness(thickness: number): void {
    this._lineSymbol.width = thickness;
    this._rtLineSymbol.get("width").value(thickness);
  }

  public addVertices(vertices: {segmentIndex: number, pointIndex: number, point: {x: number, y: number}}[]): void {
    this._rtGeometry.model().startBatch();
    vertices.forEach(vertex => {
      const segment = this._rtGraphic.elementAt([GEOMETRY, this._segmentKey as string, vertex.segmentIndex]) as RealTimeArray;
      segment.insert(vertex.pointIndex, [vertex.point.x, vertex.point.y]);
    });
    this._rtGeometry.model().completeBatch();
  }

  public deleteVertices(vertices: {segmentIndex: number, pointIndex: number}[]): void {
    this._rtGeometry.model().startBatch();
    vertices.forEach(v => {
      const segment = this._rtGraphic.elementAt([GEOMETRY, this._segmentKey as string, v.segmentIndex]) as RealTimeArray;
      segment.remove(v.pointIndex);
    });
    this._rtGeometry.model().completeBatch();
  }

  private _getSegments(): number[][][] {
    if (this._graphic.geometry.type === "polygon") {
      return (this._graphic.geometry as Polygon).rings;
    } else {
      return (this._graphic.geometry as Polyline).paths;
    }
  }
  public updateVertex(segmentIndex: number, pointIndex: number, point: {x: number, y: number}): void {
    const segmentKey = this._segmentKey as string;
    const geometry = this._graphic.geometry as Polygon;
    point = point || geometry.getPoint(segmentIndex, pointIndex);
    const updatedPoint = this._rtGraphic.elementAt([GEOMETRY, segmentKey, segmentIndex, pointIndex]) as RealTimeObject;
    const segment = this._getSegments()[segmentIndex];

    if (this._graphic.geometry.type === "polygon" && pointIndex === segment.length - 1) {
      // The last point what updated in a polygon. We need to update the first point.
      this._rtGeometry.model().startBatch();

      updatedPoint.value([point.x, point.y]);
      geometry.setPoint(segmentIndex, segment.length - 1, new esri.geometry.Point(point));

      const firstPoint = this._rtGraphic.elementAt([GEOMETRY, segmentKey, segmentIndex, 0]) as RealTimeObject;
      firstPoint.value([point.x, point.y]);
      geometry.setPoint(segmentIndex, 0, new esri.geometry.Point(point));

      this._rtGeometry.model().completeBatch();
    } else if (this._graphic.geometry.type === "polygon" && pointIndex === 0) {
      // The first point what updated in a polygon. We need to update the last point.
      this._rtGeometry.model().startBatch();

      updatedPoint.value([point.x, point.y]);
      geometry.setPoint(segmentIndex, 0, new esri.geometry.Point(point));

      const lastPoint = this._rtGraphic.elementAt([GEOMETRY, segmentKey, segmentIndex, segment.length - 1]) as RealTimeObject;
      lastPoint.value([point.x, point.y]);
      geometry.setPoint(segmentIndex, segment.length - 1, new esri.geometry.Point(point));

      this._rtGeometry.model().completeBatch();
    } else {
      updatedPoint.value([point.x, point.y]);
      geometry.setPoint(segmentIndex, pointIndex, new esri.geometry.Point(point));
    }
  }

  public setGeometry(geometry: Geometry): void {
    const g = this._rtGraphic.get(GEOMETRY) as RealTimeObject;
    switch (geometry.type) {
      case "point":
        this._rtGraphic.model().startBatch();
        const point = geometry as Point;
        g.get("x").value(point.x);
        g.get("y").value(point.y);
        this._rtGraphic.model().completeBatch();
        break;
      case "polygon":
        const rings = g.get("rings") as RealTimeArray;
        rings.value(geometry.toJSON().rings);
        break;
      case "polyline":
        const paths = g.get("paths") as RealTimeArray;
        paths.value(geometry.toJSON().paths);
        break;
      case  "multipoint":
      case "extent":
        throw new Error("can't handle geometry: " + geometry.type);
    }
  }

  remove(): void {
    this._rtGraphic.removeFromParent();
  }

  private _bindSymbol(symbol: Symbol, rtSymbol: RealTimeObject): void {
    rtSymbol.get("color").on(RealTimeObject.Events.VALUE, (evt: IConvergenceEvent) => {
      const e = evt as ArraySetValueEvent;
      const color = this._toEsriColor(e.element as RealTimeArray);
      symbol.color = color;
    });

    if (rtSymbol.hasKey("width")) {
      rtSymbol.get("width").on(RealTimeNumber.Events.VALUE, (evt: IConvergenceEvent) => {
        const e = evt as NumberSetValueEvent;
        (symbol as SimpleLineSymbol).width = e.element.value();
      });
    }
  }

  private _setColor(symbol: Symbol, rta: RealTimeArray, color: RGBColor): void {
    const c = [color.r, color.g, color.b, (color.a === undefined ? 1 : color.a)];
    symbol.color = new esri.Color(c);
    rta.value(c);
  }

  private _toEsriColor(rtColor: RealTimeArray): any {
    const c = rtColor.value();
    return new esri.Color(c);
  }
}
