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
import {RemotePointerGraphic} from "../RemotePointerGraphic";
import Map from "esri/Map";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import {RemoteStateLayer} from "../RemoteStateLayer";
import {RemoteState} from "../../../models/RemoteState";
import {IPointerCoordinates} from "../../../models/IPointerCoordinates";

export interface IRemotePointerLayerProps {
  map: Map;
  pointers: RemoteState<IPointerCoordinates>[]
}

export const RemotePointerLayer = (props: IRemotePointerLayerProps) => {
  return <RemoteStateLayer
    map={props.map}
    remoteItems={props.pointers}
    renderer={(p: RemoteState<IPointerCoordinates>, layer: GraphicsLayer) => <RemotePointerGraphic key={p.sessionId}
                                                                                layer={layer!}
                                                                                pointer={p}/>
    }
  />;
};
