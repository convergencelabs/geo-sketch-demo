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

import React, {useEffect, useState} from 'react';
import {MainArcGisMap} from "../arcgis/MainArcGisMap";
import {OverviewArcGisMap} from "../arcgis/OverviewArcGisMap";
import {TitleBar} from "../TitleBar";
import styles from "./styles.module.css";
import {SideBar} from "../SideBar";
import {Login} from "../Login";
import {ConnectionManager} from "../../utils/ConnectionManager";
import {useStores} from "../../stores/stores";

export interface IGeoSketchProps {
  urlUsername: string | null;
  demoId: string;
}

export const GeoSketch = (props: IGeoSketchProps) => {
  const [username, setUsername] = useState<string | null>(props.urlUsername);
  const [connected, setConnected] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | undefined>();
  const stores = useStores();
  const [connectionManager] = useState(new ConnectionManager(props.demoId,stores));

  const onLogin = (username: string) => {
    setUsername(username);
  };

  useEffect(() => {
    if (username !== null) {
      connectionManager.connect(username)
        .catch((e: Error) => {
          setLoginError(e.message || "Unknown login error");
          console.log(e);
        })
        .then(() => {
          setConnected(true);
        });
    }
  }, [username, connectionManager]);

  if (!connected) {
    return <Login onLogin={onLogin} error={loginError}/>;
  } else {
    return (
      <div className={styles.GeoSketch}>
        <TitleBar/>
        <div className={styles.main}>
          <div className={styles.map}>
            <MainArcGisMap/>
            <OverviewArcGisMap/>
          </div>
          <SideBar/>
        </div>
      </div>
    );
  }
};
