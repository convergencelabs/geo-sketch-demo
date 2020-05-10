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

import React, {Fragment, ReactNode, useEffect, useState} from 'react';
import Map from "esri/Map";
import GraphicsLayer from "esri/layers/GraphicsLayer";
import {esri} from "../../../utils/ArcGisLoader";

export interface IRemoteStateLayerProps<T> {
  map: Map;
  remoteItems: T[];
  renderer: (item: T, layer: GraphicsLayer) => ReactNode;
}

export const RemoteStateLayer = (props: IRemoteStateLayerProps<any>) => {
  const [layer, setLayer] = useState<GraphicsLayer | null>(null);

  useEffect(() => {
    const l = new esri.layers.GraphicsLayer();
    props.map.add(l);
    setLayer(l);

    return () => {
      props.map.remove(l);
    };
  }, [props.map]);

  if (layer !== null) {
    const rendered = props.remoteItems.map(i => props.renderer(i, layer));
    return <Fragment>{rendered}</Fragment>;
  } else {
    return null;
  }
};
