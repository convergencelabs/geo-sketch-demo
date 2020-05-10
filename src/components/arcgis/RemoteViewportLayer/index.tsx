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
import Map from "esri/Map";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import {RemoteStateLayer} from "../RemoteStateLayer";
import {RemoteViewport} from "../../../models/RemoteViewport";
import {RemoteViewportGraphic} from "../RemoteViewportGraphic";

export interface IRemoteViewportLayerProps {
  map: Map;
  viewports: RemoteViewport[]
}

export const RemoteViewportLayer = (props: IRemoteViewportLayerProps) => {
  return <RemoteStateLayer
    map={props.map}
    remoteItems={props.viewports}
    renderer={(p: RemoteViewport, layer: GraphicsLayer) => <RemoteViewportGraphic key={p.sessionId}
                                                                                  layer={layer!}
                                                                                  viewport={p}/>
    }
  />;
}
