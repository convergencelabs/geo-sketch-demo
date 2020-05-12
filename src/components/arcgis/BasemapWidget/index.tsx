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

import {useEffect} from 'react';
import {esri} from "../../../utils/ArcGisLoader";
import MapView from "esri/views/MapView";


export interface IBasemapWidgetProps {
  view: MapView;
}

export const BasemapWidget = (props: IBasemapWidgetProps) => {
  const {view} = props;


  useEffect(() => {

    const basemapGallery = new esri.widgets.BasemapGallery({
      view: view,
      container: document.createElement("div")
    });

    const bgExpand = new esri.widgets.Expand({
      view: view,
      content: basemapGallery
    });

    // close the expand whenever a basemap is selected
    basemapGallery.watch("activeBasemap", (e) => {
      bgExpand.collapse();
    });

    view.ui.add(bgExpand, "top-left");

    return () => {
      view.ui.remove(bgExpand);
    }
    // eslint-disable-next-line
  }, []);

  return null;
};
