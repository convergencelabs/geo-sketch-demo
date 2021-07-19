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

import React, {Fragment, useEffect, useState} from 'react';
import MapView from "esri/views/MapView";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import {esri} from "../../../utils/ArcGisLoader";
import {useStores} from "../../../stores/stores";
import {RemoteSelectedGraphics} from "../RemoteSelectedGraphics";
import {observer} from "mobx-react";

export interface IRemoteSelectionLayerProps {
  mapView: MapView;
}

export const RemoteSelectionLayer = observer((props: IRemoteSelectionLayerProps) => {
  const [selectionLayer, setSelectionLayer] = useState<GraphicsLayer | null>(null);
  const {modelStore} = useStores();
  const map = props.mapView.map;

  useEffect(() => {
    const layer = new esri.layers.GraphicsLayer();
    map.add(layer, map.layers.length);
    setSelectionLayer(layer);

    return () => {
      map.remove(layer);
    };
  }, [map]);

  if (selectionLayer !== null) {
    const selections = modelStore.remoteSelections.map(rs => {
      return <RemoteSelectedGraphics key={rs.sessionId} remoteSelection={rs} layer={selectionLayer} mapView={props.mapView}/>
    });
    return <Fragment>{selections}</Fragment>;
  } else {
    return null;
  }
});
