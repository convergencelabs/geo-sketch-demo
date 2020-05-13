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

import React, {useState} from 'react'
import styles from "./styles.module.css";
import {ChromePicker, ColorResult, RGBColor} from 'react-color';

export interface IColorPickerButtonProps {
  onChange: (color: RGBColor) => void;
  color: RGBColor;
}

export const ColorPickerButton = (props: IColorPickerButtonProps) => {
  const [show, setShow] = useState(false);
  const {color, onChange} = props;

  const handleClick = () => {
    setShow(!show);
  };

  const handleClose = () => {
    setShow(false);
  };

  const handleChange = (color: ColorResult) => {
    onChange(color.rgb);
  };

  const colorStyle = {
    background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`
  };

  return (
    <div className={styles.picker}>
      <div className={styles.swatch} onClick={handleClick}>
        <span className={styles.color} style={colorStyle}/>
      </div>
      {show ?
        <div className={styles.popover}>
          <div className={styles.cover} onClick={handleClose}/>
          <ChromePicker color={color} onChange={handleChange}/>
        </div> :
        null
      }
    </div>
  )
};
