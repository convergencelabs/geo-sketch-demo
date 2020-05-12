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
import {RemoteSelection} from "../../../models/RemoteSelection";
import {RemoteSelectedGraphic} from "../RemoteSelectedGraphic";
import {GraphicAdapter} from "../../../utils/GraphicAdapter";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import {colorAssigner} from "../../../utils/color-util";
import MapView from "esri/views/MapView";

export interface IRemoteSelectedGraphicsProps {
  remoteSelection: RemoteSelection;
  layer: GraphicsLayer;
  mapView: MapView;
}

export const RemoteSelectedGraphics = (props: IRemoteSelectedGraphicsProps) => {
  const graphics = props.remoteSelection.graphics.map(rto => {
    const adapter = GraphicAdapter.getAdapterFromRealTimeObject(rto);
    const color = colorAssigner.getColor(props.remoteSelection.user.userId.toGuid());
    return <RemoteSelectedGraphic key={adapter.id()}
                                  color={color}
                                  graphic={adapter.getGraphic()}
                                  layer={props.layer}
                                  mapView={props.mapView}
    />;
  });
  return <React.Fragment>{graphics}</React.Fragment>;
};
