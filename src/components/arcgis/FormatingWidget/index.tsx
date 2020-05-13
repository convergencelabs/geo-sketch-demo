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

import React, {ChangeEvent} from 'react';
import styles from "./styles.module.css";
import {faFill, faGripLines, faSlash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {ColorPickerButton} from "../../ColorPickerButton";
import {useStores} from "../../../stores/stores";
import {observer} from "mobx-react";
import {RGBColor} from "react-color";
import {GraphicAdapter} from "../../../utils/GraphicAdapter";

export const FormattingWidget = observer(() => {
  const {formattingStore} = useStores();

  function setFillColor(color: RGBColor) {
    formattingStore.setFillColor(color);
    formattingStore.graphics.forEach(g => {
      const adapter = GraphicAdapter.getAdapter(g);
      adapter.setFillColor(color);
    });
  }

  function setLineColor(color: RGBColor) {
    formattingStore.setLineColor(color);
    formattingStore.graphics.forEach(g => {
      const adapter = GraphicAdapter.getAdapter(g);
      adapter.setLineColor(color);
    });
  }

  function setLineThickness(e: ChangeEvent<HTMLInputElement>) {
    const thickness = Number(e.target.value);
    formattingStore.setLineThickness(thickness);
    formattingStore.graphics.forEach(g => {
      const adapter = GraphicAdapter.getAdapter(g);
      adapter.setLineThickness(thickness);
    });
  }

  return (
    <div className={styles.formattingWidget}>
      <div className={styles.row}>
        <span className={styles.button}><FontAwesomeIcon icon={faFill}/></span>
        <ColorPickerButton onChange={setFillColor} color={formattingStore.fillColor}/>
      </div>
      <div className={styles.row}>
        <span className={styles.button}><FontAwesomeIcon icon={faSlash}/></span>
        <ColorPickerButton onChange={setLineColor} color={formattingStore.lineColor}/>
      </div>
      <div className={styles.row}>
        <span className={styles.button}><FontAwesomeIcon icon={faGripLines}/></span>
        <input className={styles.thickness}
               type="number"
               min={0}
               value={formattingStore.lineThickness}
               onChange={setLineThickness}
        />
      </div>
    </div>
  );
});
