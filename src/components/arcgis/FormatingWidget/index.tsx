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

import React, {useRef} from 'react';
import styles from "./styles.module.css";
import {IPointerCoordinates} from "../../../models/IPointerCoordinates";

export interface LatLongWidgetProps {
  position: IPointerCoordinates | null;
}

export const LatLongWidget = (props: LatLongWidgetProps) => {
  const {position} = props;
  const widgetRef = useRef<HTMLDivElement>(null);
  const rendered = toString(position);
  return <div className={styles.latLonWidget} ref={widgetRef}>{rendered}</div>;
};

function toString(position: IPointerCoordinates | null): string {
  return position ? `${ddToDMS(position.y, true)}, ${ddToDMS(position.x, false)}` : "";
}

function ddToDMS(dd: number, lat: boolean): string {
  const d = Number(dd);
  const m = Number((dd - d) * 60);
  const s = (dd - d - m/60) * 3600;

  const direction = lat ? dd < 0 ? "S" : "N" : dd < 0 ? "W" : "E";

  return `${Math.abs(Math.round(d))}° ${Math.round(m)}' ${Math.round(s)}" ${direction}`
}