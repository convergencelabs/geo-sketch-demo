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

import React from "react";
import styles from "./styles.module.css";
import {GeoSketchSessionUser} from "../../models/GeoSketchSessionUser";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye, faLink, faExternalLinkSquareAlt} from '@fortawesome/free-solid-svg-icons';
import {colorAssigner} from "../../utils/color-util";

export interface IPresenceItem {
  user: GeoSketchSessionUser;
}

export const PresenceListItem = (props: IPresenceItem) => {
  const {user} = props;

  const color = colorAssigner.getColorAsHex(user.user.userId.toGuid());

  return (
    <div className={styles.presenceItem}>
      <span className={styles.username} style={{borderColor: color}}>{user.user.displayName}</span>
      <FontAwesomeIcon icon={faEye} size={"xs"}/>
      <FontAwesomeIcon icon={faExternalLinkSquareAlt} size={"xs"}/>
      <FontAwesomeIcon icon={faLink} size={"xs"}/>
    </div>
  );
};
