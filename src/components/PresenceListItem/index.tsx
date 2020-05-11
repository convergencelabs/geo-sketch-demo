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
import {faExternalLinkSquareAlt, faEye, faLink} from '@fortawesome/free-solid-svg-icons';
import {colorAssigner} from "../../utils/color-util";

export interface IPresenceItem {
  user: GeoSketchSessionUser;
  linkedUser: GeoSketchSessionUser | null;
  onPreview: (user: GeoSketchSessionUser) => void;
  onGoto: (user: GeoSketchSessionUser) => void;
  onLink: (user: GeoSketchSessionUser) => void;
  onClear: () => void;
}

export const PresenceListItem = (props: IPresenceItem) => {
  const {user, linkedUser, onPreview, onGoto, onLink, onClear} = props;

  const color = colorAssigner.getColorAsHex(user.user.userId.toGuid());

  const startPreview = () => {
    if (!linkedUser) {
      onPreview(user);
    }
  };

  const endPreview = () => {
    if (!linkedUser) {
      onClear();
    }
  };

  const goTo = () => {
    if (!linkedUser) {
      onGoto(user)
    }
  };

  const toggleLinked = () => {
    if (linkedUser === user) {
      onClear();
    } else {
      onLink(user);
    }
  };

  const linked = user === linkedUser;

  const username = user.local ? user.user.displayName + " (you)" : user.user.displayName;
  const actions = user.local ? null :
    <React.Fragment>
      <FontAwesomeIcon icon={faEye} size={"xs"} onMouseEnter={startPreview} onMouseLeave={endPreview}/>
      <FontAwesomeIcon icon={faExternalLinkSquareAlt} size={"xs"} onClick={goTo}/>
      <FontAwesomeIcon className={linked ? styles.linked : ""} icon={faLink} size={"xs"} onClick={toggleLinked}/>
    </React.Fragment>;

  return (
    <div className={styles.presenceItem}>
      <span className={styles.username} style={{borderColor: color}}>{username}</span>
      {actions}
    </div>
  );
};
