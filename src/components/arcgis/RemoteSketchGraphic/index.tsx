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

import React from 'react';
import Graphic from "esri/Graphic";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import {esri} from "../../../utils/ArcGisLoader";
import {RemoteStateGraphic} from "../RemoteStateGraphic";
import {colorAssigner} from "../../../utils/color-util";
import {RemoteState} from "../../../models/RemoteState";
import Symbol from "esri/symbols/Symbol";

export interface IRemotePointerSketchProps {
  layer: GraphicsLayer;
  pointer: RemoteState<any>;
}

export const RemoteSketchGraphic = (props: IRemotePointerSketchProps) => {
  const {pointer, layer} = props;
  return <RemoteStateGraphic
    layer={layer}
    item={pointer}
    create={createSketch}
    update={(state: RemoteState<any>, graphic: Graphic) => {
      graphic.geometry = esri.geometry.support.jsonUtils.fromJSON(state.value);
    }}
  />;
};

function createSketch(sketch: RemoteState<any>): Graphic {
  const geometry = esri.geometry.support.jsonUtils.fromJSON(sketch.value);
  const {r, g, b} = colorAssigner.getColor(sketch.user.userId.toGuid());

  let symbol: Symbol;

  const lineSymbol = new esri.symbols.SimpleLineSymbol({
    width: 1,
    color: [r, g, b, 0.7]
  });

  if (geometry.type === "polyline") {
    symbol = lineSymbol;
  } else {
    symbol = new esri.symbols.SimpleFillSymbol({
      outline: lineSymbol,
      color: [r, g, b, 0.25]
    });
  }

  return new esri.Graphic({geometry, symbol});
}
