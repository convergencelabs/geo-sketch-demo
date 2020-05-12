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
import {IPointerCoordinates} from "../../../models/IPointerCoordinates";

export interface IRemotePointerGraphicProps {
  layer: GraphicsLayer;
  pointer: RemoteState<IPointerCoordinates>;
}

export const RemotePointerGraphic = (props: IRemotePointerGraphicProps) => {
  const {pointer, layer} = props;
  return <RemoteStateGraphic
    layer={layer}
    item={pointer}
    create={createPointer}
    update={(state: RemoteState<IPointerCoordinates>, graphic: Graphic) => {
      graphic.geometry = new esri.geometry.Point(state.value);
    }}
  />;
};

function createPointer(pointer: RemoteState<IPointerCoordinates>): Graphic {
  const geometry = new esri.geometry.Point(pointer.value);
  const {r, g, b} = colorAssigner.getColor(pointer.user.userId.toGuid());
  const color = [r, g, b, 0.7];
  const symbol = new esri.symbols.SimpleMarkerSymbol({
    style: "path",
    outline: {style: "none"},
    path: PointerPath,
    xoffset: "5px",
    yoffset: "-7px",
    color
  });
  return new esri.Graphic({geometry, symbol});
}

const PointerPath = 'm 75.300095,89.125 c -2.5188,0 -5.03,0 -7.55,0.025 -0.36,57.61001 -0.14488,115.23998 -0.22504,172.85 0.11024,30.56004 -0.21968,61.12498 0.2,91.675 10.37032,-0.01 20.74008,0.08 31.1,0 0.27744,-4.44488 0.348,-8.93234 0.35008,-13.425 l 0,-2.025 2.024965,0.025 c 4.40976,0.0289 8.81048,0.002 13.2,-0.05 0.10592,-4.5143 0.42376,-9.05769 -0.075,-13.575 l -0.27496,-2.525 2.52504,0.325 c 4.54232,0.57852 9.13448,0.197 13.67496,0.1 0.0866,-4.35032 0.1844,-8.70374 0.22504,-13.05 l 0.025,-2 2,0.025 c 3.43216,0.0267 6.87392,-0.0112 10.32496,-0.2 l 2.27504,-0.125 -0.17504,2.275 c -0.71368,9.51482 0.89384,19.03621 0.37504,28.55 4.48976,0.14849 8.97896,0.2084 13.47504,0.25 l 1.94992,0.025 0.025,1.95 c 0.0878,9.64042 0.0657,19.27631 0.22504,28.925 4.4364,0.087 8.87376,0.1386 13.32496,0.15 l 1.97504,0 0.025,1.975 c 0.0801,4.49655 0.11752,8.96595 0.1,13.475 10.43992,0.14 20.88512,0.11 31.32496,0.05 0.37624,-4.42817 0.5416,-8.91848 0.22504,-13.425 l -0.15,-2.2 2.2,0.05 c 4.42952,0.12337 8.8712,0.0862 13.25,-0.025 0.15,-10.38998 0.095,-20.78495 -0.025,-31.175 -4.46072,-0.12198 -8.91296,-0.1782 -13.37496,-0.225 l -1.95,-0.025 -0.025,-1.95 c -0.15104,-9.65978 -0.078,-19.28792 -0.12504,-28.95 -4.46824,-0.1639 -8.97896,-0.24806 -13.47496,-0.125 l -2.12504,0.05 0.075,-2.125 c 0.15224,-3.72234 0.2132,-7.43125 0.2,-11.125 l 0,-2 2,0 c 19.96048,-0.0353 39.9032,-0.0274 59.87504,-0.25 0.13008,-10.35002 0.16488,-20.69997 -0.025,-31.05 -4.49024,0 -8.97256,-0.0334 -13.45008,-0.1 l -1.94992,-0.025 -0.025,-1.95 c -0.065,-4.48808 -0.10104,-8.98374 -0.075,-13.475 -4.46624,-0.1132 -8.92296,-0.1394 -13.4,-0.15 l -1.97504,0 -0.025,-1.975 c -0.0491,-4.45188 -0.088,-8.89958 -0.17504,-13.35 -4.4552,-0.199 -8.93808,-0.3182 -13.45,-0.275 l -2.02504,0.025 0,-2.025 c -0.01,-4.50767 -0.031,-9.00584 -0.075,-13.5 -4.49248,0.0263 -8.99208,-0.009 -13.47496,-0.1 l -1.95008,-0.05 0,-1.95 c -0.0118,-4.41425 -0.0446,-8.8033 -0.17496,-13.2 -4.43424,-0.243 -8.87832,-0.2822 -13.35,-0.3 l -1.97504,0 -0.025,-1.975 c -0.0707,-4.49178 -0.1176,-8.96993 -0.1,-13.475 -4.49776,-0.0175 -8.98584,-0.0518 -13.47504,-0.125 l -1.9,-0.025 -0.075,-1.9 c -0.1608,-4.49031 -0.34096,-9.00011 -0.35,-13.5 -4.38576,-0.1042 -8.76824,-0.122 -13.17504,-0.125 l -1.94992,0 -0.0501,-1.95 c -0.1088,-4.4705 -0.1688,-8.96599 -0.12496,-13.45 -4.49192,-0.0524 -8.9856,-0.0844 -13.47504,-0.15 l -1.9,-0.025 -0.075,-1.9 c -0.17592,-4.48987 -0.24096,-8.98034 -0.25,-13.5 -4.46808,-0.1045 -8.92472,-0.1282 -13.4,-0.15 l -1.97504,0 -0.025,-1.975 c -0.0282,-4.4654 -0.0543,-8.94064 -0.15,-13.4 -4.48952,-0.0262 -9.0016,-0.0375 -13.5,-0.075 l -1.950005,-0.025 -0.02496,-1.95 c -0.04112,-4.47935 -0.066,-8.97978 -0.07504,-13.475 -4.49416,-0.1306 -9.02416,-0.1016 -13.55,-0.075 l -1.97496,0 -0.02504,-1.975 c -0.0284,-4.508216 -0.10856,-9.018512 -0.3,-13.5 -2.51496,-0.015 -5.03128,-0.025 -7.55,-0.025 z';
