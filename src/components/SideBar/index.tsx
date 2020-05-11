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

import React, {useState} from "react";
import styles from "./styles.module.css";
import {PresenceList} from "../PresenceList";
import {ChatPanel} from "../ChatPanel";
import {SideBarTitle} from "../SideBarTitle";


export const SideBar = () => {
  const [open, setOpen] = useState(true);

  const toggle = () => setOpen(!open)

  return (
    <div className={open ? styles.sideBarOpen : styles.sideBarClosed}>
      <span className={styles.toggle} onClick={toggle}>
        <span className={styles.toggleInner}>
          <span className={styles.arrow}/>
        </span>
      </span>
      <SideBarTitle title="Participants"/>
      <PresenceList/>
      <SideBarTitle title="Group Chat"/>
      <ChatPanel/>
    </div>
  );
};