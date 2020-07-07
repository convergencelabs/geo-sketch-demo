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

import React, {ChangeEvent, KeyboardEvent, useState} from 'react';
import styles from "./styles.module.css";
import logo from "../../assets/images/logo.png";

export interface ILoginProps {
  onLogin: (username: string) => void;
  error?: string;
}

export const Login = (props: ILoginProps) => {
  const [username, setUsername] = useState("");

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      props.onLogin(username);
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const onClick = () => {
    props.onLogin(username);
  };

  return (
    <div className={styles.login}>
      <div className={styles.title}>
        <img src={logo} alt="Convergence Logo"/>
        <span className={styles.name}>Convergence Geo Sketch</span>
      </div>
      <div className={styles.form}>
        <label className={styles.label}>Display Name</label>
        <input id="username" value={username} onChange={onChange} onKeyDown={onKeyDown}/>
      </div>
      <div className={styles.note}>(Note: Any display name will work!)</div>
      <div className={styles.buttons}>
        <button className={styles.button} disabled={username === ""} onClick={onClick}>Login</button>
      </div>
    </div>
  );
};
