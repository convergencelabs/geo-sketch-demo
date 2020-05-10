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

import {loadModules, loadCss} from 'esri-loader';
import Color from "esri/Color";
import Map from "esri/Map";
import Graphic from "esri/Graphic";

import watchUtils from "esri/core/watchUtils";

import Extent from "esri/geometry/Extent";
import Geometry from "esri/geometry/Geometry";
import Point from "esri/geometry/Point";
import Polygon from "esri/geometry/Polygon";
import Polyline from "esri/geometry/Polyline";

import jsonUtils from "esri/geometry/support/jsonUtils";

import GraphicsLayer from "esri/layers/GraphicsLayer";
import Symbol from  "esri/symbols/Symbol"
import SimpleFillSymbol from "esri/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "esri/symbols/SimpleLineSymbol";
import SimpleMarkerSymbol from "esri/symbols/SimpleMarkerSymbol";

import MapView from "esri/views/MapView";
import Sketch from "esri/widgets/Sketch";


const modules = [
  "esri/Color",
  "esri/Graphic",
  "esri/Map",

  "esri/core/watchUtils",

  "esri/geometry/Extent",
  "esri/geometry/Geometry",
  "esri/geometry/Point",
  "esri/geometry/Polygon",
  "esri/geometry/Polyline",

  "esri/geometry/support/jsonUtils",

  "esri/layers/GraphicsLayer",

  "esri/symbols/SimpleFillSymbol",
  "esri/symbols/SimpleLineSymbol",
  "esri/symbols/SimpleMarkerSymbol",
  "esri/symbols/Symbol",

  "esri/views/MapView",
  "esri/widgets/Sketch"
];

export interface IEsri {
  Color: typeof Color;
  Map: typeof Map;
  Graphic: typeof Graphic;
  core: {
    watchUtils: typeof watchUtils;
  },
  geometry: {
    Extent: typeof Extent;
    Geometry: typeof Geometry;
    Point: typeof Point;
    Polygon: typeof Polygon;
    Polyline: typeof Polyline;
    support: {
      jsonUtils: jsonUtils;
    }
  }
  layers: {
    GraphicsLayer: typeof GraphicsLayer;
  };
  symbols: {
    SimpleFillSymbol: typeof SimpleFillSymbol;
    SimpleLineSymbol: typeof SimpleLineSymbol;
    SimpleMarkerSymbol: typeof SimpleMarkerSymbol;
    Symbol: typeof Symbol;
  },
  views: {
    MapView: typeof MapView;
  };
  widgets: {
    Sketch: typeof Sketch;
  };
}

export const esri: IEsri = {} as any as IEsri;

export class ArcGisLoader {
  static async init(): Promise<void> {
    loadCss();
    const resolved = await (loadModules(modules) as Promise<any[]>);

    modules.forEach((module: string, index: number) => {
      const path = module.split("/");
      path.shift();

      let currentTarget = esri as any;
      for (let i = 0; i < path.length - 1; i++) {
        const p = path[i];
        if (currentTarget[p] === undefined) {
          currentTarget[p] = {};
        }

        currentTarget = currentTarget[p];
      }

      currentTarget[path[path.length - 1]] = resolved[index];
    });
  }
}

