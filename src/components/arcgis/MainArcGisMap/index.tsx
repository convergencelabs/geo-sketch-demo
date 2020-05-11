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
import {esri} from "../../../utils/ArcGisLoader"
import {RemotePointerLayer} from "../RemotePointerLayer";
import MapView from "esri/views/MapView";
import {rateLimitWithCancel} from "../../../utils/rateLimit";
import {LatLongWidget} from "../LatLongWidget";
import {SketchWidget} from "../SketchWidget";
import {useStores} from "../../../stores/stores";
import {observer} from "mobx-react";
import {ParticipantActionType} from "../../../models/ParticipantAction";

export const MainArcGisMap = observer(() => {
  const {pointerStore, viewportStore, participantStore} = useStores();
  const mapRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<MapView | null>(null);
  const [previousExtent, setPreviousExtent] = useState<any>(null);

  useEffect(() => {
    const map = new esri.Map({
      basemap: "streets",
    });

    const view = new esri.views.MapView({
      map: map,  // References a Map instance
      container: mapRef.current!,
      center: [0, 0],
      zoom: 4
    });

    setView(view);

    const pointerCallback = rateLimitWithCancel((event) => {
      const point = view.toMap({x: event.x, y: event.y});
      const {longitude, latitude} = point;

      pointerStore.setLocalState({x: longitude, y: latitude})
    }, 40);

    const moveHandle = view.on("pointer-move", pointerCallback.callback);
    const leaveHandle = view.on("pointer-leave", () => {
      pointerCallback.cancel();
      pointerStore.clearLocalState();
    });

    view.ui.components = ["zoom"];

    const extentCallback = rateLimitWithCancel((e) => {
      const {xmin, xmax, ymin, ymax} = e;
      const extent = {xmin, xmax, ymin, ymax};
      viewportStore.setLocalState(extent);
    }, 40);
    const extentHandle = esri.core.watchUtils.watch(view, "extent", extentCallback.callback);

    return () => {
      moveHandle.remove();
      leaveHandle.remove();
      view.destroy();
      map.destroy();
      extentHandle.remove();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!view) {
      return;
    }

    // console.log(participantStore.participantAction);

    if (participantStore.participantAction !== null) {
      const remoteViewport = viewportStore.remoteStateMap.get(participantStore.participantAction.participant.sessionId);

      if (participantStore.participantAction.actionType === ParticipantActionType.PREVIEW && previousExtent === null) {
        setPreviousExtent(view.extent.toJSON());
      }

      if (remoteViewport) {
        const extent = {
          ...remoteViewport.extent, spatialReference: {
            wkid: 102100
          }
        };
        console.log("going to: " + JSON.stringify(extent));
        view.extent = new esri.geometry.Extent(extent);
      } else {
        console.log("coulndt fine vp");
      }
    } else if (previousExtent) {
      const extent = {
        ...previousExtent, spatialReference: {
          wkid: 102100
        }
      };
      console.log("going back to: " + JSON.stringify(extent));
      view.extent = new esri.geometry.Extent(extent);
      setPreviousExtent(null);
    }
  }, [participantStore.participantAction, view, viewportStore.remoteState]);

  const pointerLayer = view !== null ?
    <RemotePointerLayer map={view.map} pointers={pointerStore.remoteState}/> : null;

  const latLongWidget = view !== null ?
    <LatLongWidget position={pointerStore.localState}/> : null;

  const sketchWidget = view !== null ?
    <SketchWidget view={view}/> : null;

  return (
    <React.Fragment>
      <div className={styles.mainMap} ref={mapRef}/>
      {sketchWidget}
      {pointerLayer}
      {latLongWidget}
    </React.Fragment>
  );
});
