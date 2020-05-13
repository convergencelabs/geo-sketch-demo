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

import {ColorAssigner} from '@convergence/color-assigner';

import Color from "esri/Color";
import {esri} from "./ArcGisLoader";
import {RGBColor} from "react-color";

export const colorAssigner = new ColorAssigner(ColorAssigner.Palettes.DARK_12);


export function reactColorToEsriColor(color: RGBColor): Color {
  const {r, g, b, a} = color;
  const colorArray = [r, g, b];
  if (a !== undefined) {
    colorArray.push(a);
  }
  return new esri.Color(colorArray);
}

export function esriColorToReactColor(color: Color): RGBColor {
  const {r, g, b, a} = color;
  return {r, g, b, a};
}
