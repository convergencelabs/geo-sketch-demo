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

import {useEffect, useState} from 'react';
import Graphic from "esri/Graphic";
import GraphicsLayer from "esri/layers/GraphicsLayer";

export interface IRemotePointerGraphicProps {
  layer: GraphicsLayer;
  item: any;
  create: (item: any) => Graphic;
  update: (item: any, graphic: Graphic) => void;
}

export const RemoteStateGraphic = (props: IRemotePointerGraphicProps) => {
  const [graphic, setGraphic] = useState<Graphic | null>(null);
  const {item, layer, update, create} = props;

  useEffect(() => {
    const graphic = create(item);
    layer.add(graphic);
    setGraphic(graphic);

    return () => {
      layer.remove(graphic);
    }
    // eslint-disable-next-line
  }, [layer]);

  useEffect(() => {
    if (graphic !== null) {
     update(item, graphic);
    }
  }, [item, graphic, update]);

  return null;
};
