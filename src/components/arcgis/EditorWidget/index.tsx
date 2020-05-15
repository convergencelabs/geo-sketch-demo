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

import React, {useState} from 'react';
import styles from "./styles.module.css";
import {observer} from "mobx-react";
import {useStores} from "../../../stores/stores";
import {SharedTextArea} from "../../CollaborativeTextArea";
import {GraphicAdapter} from "../../../utils/GraphicAdapter";
import {faChevronLeft, faEdit} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export const EditorWidget = observer(() => {

  const {formattingStore} = useStores();

  const [expanded, setExpanded] = useState(false);

  if (formattingStore.graphics.length === 1) {
    const g = formattingStore.graphics[0];
    const adapter = GraphicAdapter.getAdapter(g);
    const description = adapter.getDescriptionAttribute();

    const setDescription = (value: string) => {
      g.setAttribute("description", value);
    };

    const toggle = () => {
      setExpanded(!expanded);
    };
    const icon = expanded ? faChevronLeft : faEdit;
    const widgetClass = expanded ? styles.expanded : styles.collapsed;

    return (
      <div className={widgetClass}>
        <div className={styles.expanderButton} onClick={toggle}>
          <FontAwesomeIcon icon={icon}/>
        </div>
        <div className={styles.editorWidget}>
          <div className={styles.title}>Edit Feature Details</div>

          <div className={styles.label}>Title</div>
          <input/>

          <div className={styles.label}>Description</div>
          <SharedTextArea stringModel={description} onChange={setDescription}/>
        </div>
      </div>
    );
  } else {
    return null;
  }
});
