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

import {action, observable} from "mobx";
import Graphic from "esri/Graphic";
import {RGBColor} from "react-color";
import {GraphicAdapter} from "../utils/GraphicAdapter";
import {RealTimeObject} from "@convergence/convergence";

export class FormattingStore {

  @observable
  public lineThickness: number = 1;

  @observable
  public fillColor: RGBColor = {r: 0, g: 0, b: 0, a: .25 };

  @observable
  public lineColor: RGBColor = {r: 0, g: 0, b: 0, a: 1 };

  @observable
  public graphics: Graphic[] = [];

  @action
  public setSelectedGraphics(graphics: Graphic[]) {
    this.graphics = graphics;
    if (graphics.length === 1) {
      const graphic = graphics[0];

      // The Esri sketch widget actually changes the color of the selected graphic
      // so we can't get it from the graphic. We need to get it from the convergence
      // representation.
      const symbol = GraphicAdapter.getAdapter(graphic).getRealTimeObject().get("symbol") as RealTimeObject;
      const [r, g, b, a] = symbol.get("color").value() as number[];

      this.fillColor = {r, g, b, a: a / 255};

      if (symbol.hasKey("outline")) {
        const outline = symbol.get("outline") as RealTimeObject;
        this.lineThickness = outline.get("width").value() as number;
        const [r, g, b, a] = outline.get("color").value() as number[];
        this.lineColor = {r, g, b, a: a / 255};
      }
    }
  }

  @action
  public setLineThickness(lineThickness: number) {
    this.lineThickness = lineThickness;
  }

  @action
  public setLineColor(lineColor: RGBColor) {
    this.lineColor = lineColor;
  }

  @action
  public setFillColor(fillColor: RGBColor) {
    this.fillColor = fillColor;
  }
}
