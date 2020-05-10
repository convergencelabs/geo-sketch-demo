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

import MapView from "esri/views/MapView";
import Point from "esri/geometry/Point";
import {esri} from "./ArcGisLoader";


export class GeometryEngine {
  private _map: MapView;

  constructor(map: MapView) {
    this._map = map;
  }

  public transformGeometry(geometry: any, transform: any): any {
    switch (geometry.type) {
      case "point":
        return this._transformPoint(geometry, transform);
      case "polygon":
        return this._transformPoly(geometry, transform, "rings");
      case "polyline":
        return this._transformPoly(geometry, transform, "paths");
      case  "multipoint":
      case "extent":
        throw new Error("can't handle geometry: " + geometry.type);
    }
  }

  private _transformPoly(geometry: any, transform: any, prop: string): any {
    // const screenGeometry =
    //   this._Esri.ScreenUtils.toScreenGeometry(
    //   this._map.extent, this._map.width, this._map.height, geometry);
    //
    // screenGeometry[prop].forEach((ring: any[], ringIndex: number) => {
    //   ring.forEach((point, pointIndex) => {
    //     screenGeometry.setPoint(
    //       ringIndex,
    //       pointIndex,
    //       new esri.geometry.Point({x: point[0] + transform.dx, y: point[1] + transform.dy}));
    //   });
    // });
    //
    // const mg = this._Esri.ScreenUtils.toMapGeometry(
    //   this._map.extent, this._map.width, this._map.height, screenGeometry);
    //
    // return mg;
  }

  private _transformPoint(point: Point, transform: any): Point {
    const screenPoint = this._map.toScreen(point);
    screenPoint.x = screenPoint.x + transform.dx;
    screenPoint.y = screenPoint.y + transform.dy;
    return this._map.toMap(screenPoint);
  }

  public scaleGeometry(geometry: any, from: any, dx: number, dy: number): any {
    switch (geometry.type) {
      case "polygon":
        return this._scalePoly(geometry, from, dx, dy, "rings");
      case "polyline":
        return this._scalePoly(geometry, from, dx, dy, "paths");
      case  "multipoint":
      case "extent":
        throw new Error("can't handle geometry: " + geometry.type);
    }
  }

  private _scalePoly(geometry: any, from: any, dx: number, dy: number, segmentKey: string): any {
    // const screenGeometry = this._Esri.ScreenUtils.toScreenGeometry(
    //   this._map.extent, this._map.width, this._map.height, geometry);
    //
    // screenGeometry[segmentKey].forEach((ring: any[], ringIndex: number) => {
    //   ring.forEach((p, pointIndex) => {
    //     const point = screenGeometry.getPoint(ringIndex, pointIndex);
    //     const scaled = this._scalePoint(point, from, dx, dy);
    //     screenGeometry.setPoint(ringIndex, pointIndex, scaled);
    //   });
    // });
    //
    // const mg = this._Esri.ScreenUtils.toMapGeometry(
    //   this._map.extent, this._map.width, this._map.height, screenGeometry);
    //
    // return mg;
  }

  private _scalePoint(point: any, from: any, dx: number, dy: number): Point {
    const distanceX = point.x - from.x;
    const distanceY = point.y - from.y;
    const newDistanceX = distanceX * dx;
    const newDistanceY = distanceY * dy;

    const newX = from.x + newDistanceX;
    const newY = from.y + newDistanceY;

    return new esri.geometry.Point({x: newX, y: newY});
  }
}
