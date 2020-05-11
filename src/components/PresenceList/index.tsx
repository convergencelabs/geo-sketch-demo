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

export const PresenceList = observer(() => {
  const {participantStore} = useStores();

  const users = Array
    .from(participantStore.participants.values())
    .map(u => <PresenceListItem key={u.sessionId} user={u}/>);

  return (
    <div className={styles.presenceList}>
      {users}
    </div>
  );
});
