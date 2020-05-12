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

import React, {useEffect, useRef, useState} from 'react';
import styles from "./styles.module.css";
import {esri} from "../../../utils/ArcGisLoader";
import {RemoteViewportLayer} from "../RemoteViewportLayer";
import MapView from "esri/views/MapView";
import {useStores} from "../../../stores/stores";
import {observer} from "mobx-react";

export const OverviewArcGisMap = observer(() => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const { viewportStore } = useStores();
  const [open, setOpen] = useState(true);
  const [view, setView] = useState<MapView | null>(null);

  useEffect(() => {
    const map = new esri.Map({
      basemap: "streets"
    });

    const view = new esri.views.MapView({
      map: map,
      container: mapRef.current!
    });

    view.ui.components = [];

    // The only way to disable navigation is to block the events.
    // So we disable the lot of them here.

    view.on("drag", function(event) {
      event.stopPropagation();
    });

    view.on("key-down", function(event) {
      const prohibitedKeys = ["+", "-", "Shift", "_", "="];
      const keyPressed = event.key;
      if (prohibitedKeys.indexOf(keyPressed) !== -1) {
        event.stopPropagation();
      }
    });

    view.on("mouse-wheel", function(event) {
      event.stopPropagation();
    });

    view.on("double-click", function(event) {
      event.stopPropagation();
    });

    view.on("drag", ["Shift"], function(event) {
      event.stopPropagation();
    });

    view.on("drag", ["Shift", "Control"], function(event) {
      event.stopPropagation();
    });

    view.when(() => {
      setView(view);
    });

    return () => {
      view.destroy();
      map.destroy();
    }
    // eslint-disable-next-line
  }, []);

  function toggle() {
    setOpen(!open);
  }

  const viewportLayer = view !== null ?
    <RemoteViewportLayer map={view.map} viewports={viewportStore.remoteState}/> : null;

  return (
    <React.Fragment>
      <div className={open ? styles.opened : styles.closed}>
        <div className={styles.map} ref={mapRef}/>
        <div className={styles.toggle} onClick={toggle}>
          <i className={styles.arrow}/>
        </div>
      </div>
      {viewportLayer}
    </React.Fragment>
  );
});
