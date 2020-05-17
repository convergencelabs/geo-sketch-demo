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
import {sketchStore, useStores} from "../../../stores/stores";
import {observer} from "mobx-react";
import {ParticipantActionType} from "../../../models/ParticipantAction";
import {RemoteSelectionLayer} from "../RemoteSelectionLayer";
import {BasemapWidget} from "../BasemapWidget";
import {FormattingWidget} from "../FormatingWidget";
import {EditorWidget} from "../EditorWidget";
import {RemoteSketchLayer} from "../RemoteSketchLayer";

export const MainArcGisMap = observer(() => {
  const {pointerStore, viewportStore, participantStore, basemapStore} = useStores();
  const mapRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<MapView | null>(null);
  const [previousExtent, setPreviousExtent] = useState<any>(null);
  const [previousBasemap, setPreviousBasemap] = useState<any>(null);

  useEffect(() => {
    const map = new esri.Map({
      basemap: new esri.Basemap({
        portalItem: {
          id: basemapStore.localState
        }
      })
    });

    const view = new esri.views.MapView({
      map: map,  // References a Map instance
      container: mapRef.current!,
      center: [0, 0],
      zoom: 4
    });

    view.when(() => {
      setView(view);
    }).catch(e => console.log(e));

    const pointerCallback = rateLimitWithCancel((event) => {
      const point = view.toMap({x: event.x, y: event.y});
      const {longitude, latitude} = point;

      pointerStore.setLocalState({x: longitude, y: latitude});
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

    const basemapHandle = esri.core.watchUtils.watch(view.map, "basemap", () => {
      const basemap = view.map.basemap;
      basemapStore.setLocalState(basemap.portalItem.id);
    });

    return () => {
      moveHandle.remove();
      leaveHandle.remove();
      view.destroy();
      map.destroy();
      extentHandle.remove();
      basemapHandle.remove();
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!view) {
      return;
    }

    if (participantStore.participantAction !== null) {
      const remoteViewport = viewportStore.remoteStateMap.get(participantStore.participantAction.participant.sessionId);
      const remoteBasemap = basemapStore.remoteStateMap.get(participantStore.participantAction.participant.sessionId);

      if (participantStore.participantAction.actionType === ParticipantActionType.PREVIEW && previousExtent === null) {
        setPreviousExtent(view.extent.toJSON());
        setPreviousBasemap(view.map.basemap);
      }

      if (remoteViewport) {
        const extent = {
          ...remoteViewport.value, spatialReference: {
            wkid: 102100
          }
        };

        view.extent = new esri.geometry.Extent(extent);
      }

      if (remoteBasemap && view.map.basemap.portalItem.id !== remoteBasemap.value) {
        view.map.basemap =  new esri.Basemap({
          portalItem: {
            id: remoteBasemap.value
          }
        });
      }
    } else {
      if (previousExtent) {
        const extent = {
          ...previousExtent, spatialReference: {
            wkid: 102100
          }
        };
        view.extent = new esri.geometry.Extent(extent);
        setPreviousExtent(null);
      }

      if (previousBasemap) {
        view.map.basemap = previousBasemap;
        setPreviousBasemap(null);
      }
    }
    // eslint-disable-next-line
  }, [participantStore.participantAction, view, viewportStore.remoteState, basemapStore.remoteState]);

  const widgets = view !== null ?
    <React.Fragment>
      <LatLongWidget position={pointerStore.localState}/>
      <BasemapWidget view={view}/>
      <RemoteSelectionLayer mapView={view}/>
      <SketchWidget view={view}/>
      <FormattingWidget/>
      <EditorWidget />
      <RemoteSketchLayer map={view.map} sketches={sketchStore.remoteState}/>
      <RemotePointerLayer map={view.map} pointers={pointerStore.remoteState}/>
    </React.Fragment> : null;

  return (
    <React.Fragment>
      <div className={styles.mainMap} ref={mapRef}/>
      {widgets}
    </React.Fragment>
  );
});
