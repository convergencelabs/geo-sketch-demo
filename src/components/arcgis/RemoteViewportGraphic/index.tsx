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
import {IViewportExtent} from "../../../models/IViewportExtent";
import {RemoteState} from "../../../models/RemoteState";

export interface IRemoteViewportGraphicProps {
  layer: GraphicsLayer;
  viewport: RemoteState<IViewportExtent>;
}

export const RemoteViewportGraphic = (props: IRemoteViewportGraphicProps) => {
  const {viewport, layer} = props;
  return <RemoteStateGraphic
    layer={layer}
    item={viewport}
    create={createViewport}
    update={(viewport: RemoteState<IViewportExtent>, graphic: Graphic) => {
      graphic.geometry = new esri.geometry.Extent({...viewport.value, spatialReference: {
          wkid: 102100
        }});
    }}
  />;
};

function createViewport(viewport: RemoteState<IViewportExtent>): Graphic {
  const geometry = new esri.geometry.Extent({...viewport.value, spatialReference: {
      wkid: 102100
    }});

  const {r, g, b} = colorAssigner.getColor(viewport.user.userId.toGuid());
  const symbol = new esri.symbols.SimpleFillSymbol({
    outline: {
      width: 1,
      style: "solid",
      color: [r, g, b, 0.8]
    },
    color: [r, g, b, 0.15]
  });
  return new esri.Graphic({geometry, symbol});
}


