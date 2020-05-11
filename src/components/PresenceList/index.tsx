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
import {PresenceListItem} from "../PresenceListItem";
import {useStores} from "../../stores/stores";
import {observer} from "mobx-react";
import {GeoSketchSessionUser} from "../../models/GeoSketchSessionUser";
import {ParticipantAction, ParticipantActionType} from "../../models/ParticipantAction";

export const PresenceList = observer(() => {
  const {participantStore} = useStores();

  const onPreview = (user: GeoSketchSessionUser) => {
    participantStore.setParticipantAction(ParticipantAction.preview(user));
  };

  const onGoto = (user: GeoSketchSessionUser) => {
    participantStore.setParticipantAction(ParticipantAction.goto(user));
    setTimeout(() => {
      participantStore.setParticipantAction(null);
    }, 0);
  };

  const onLink = (user: GeoSketchSessionUser) => {
    participantStore.setParticipantAction(ParticipantAction.link(user));
  };

  const onClear = () => {
    participantStore.setParticipantAction(null);
  };

  const linkedUser = participantStore.participantAction?.actionType === ParticipantActionType.LINK ?
    participantStore.participantAction.participant : null;

  const users = Array.from(participantStore.participants.values());
  users.sort(u => {
    if (u.local) {
      return -1;
    } else {
      return (u.user.displayName || "").localeCompare(u.user.displayName!);
    }
  })

  const userComponents = users.map(u => <PresenceListItem
    key={u.sessionId}
    user={u}
    linkedUser={linkedUser}
    onPreview={onPreview}
    onGoto={onGoto}
    onLink={onLink}
    onClear={onClear}
  />);

  return (
    <div className={styles.presenceList}>
      {userComponents}
    </div>
  );
});
