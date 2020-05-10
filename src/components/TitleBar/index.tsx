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

import logo from "../../assets/images/logo.png";
import styles from "./styles.module.css";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import {ToastContainer, toast} from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import {faShareSquare, faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons';
import {faGithub} from '@fortawesome/free-brands-svg-icons';

import CopyToClipboard from 'react-copy-to-clipboard';

export const TitleBar = () => {

  function onNewWindow() {
    window.open(window.location.href, "_blank");
  }

  function onCopy() {
    toast.success("Share URL copied to clipboard!");
  }

  return (
    <div className={styles.titleBar}>
      <ToastContainer
        position="top-center"
        autoClose={2500}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover/>
      <img className={styles.logo} src={logo} alt="Convergence Logo"/>
      <a className={styles.title} href="https://convergence.io" target="_blank" rel="noopener noreferrer">
        <span>Convergence Geo Sketch</span>
      </a>
      <div className={styles.share}>
        <a href="https://github.com/convergencelabs/geo-sketch-demo" target="_blank" rel="noopener noreferrer">
          <span>Code <FontAwesomeIcon icon={faGithub}/></span>
        </a>
        <CopyToClipboard text={window.location.href} onCopy={onCopy}>
          <span>Share <FontAwesomeIcon icon={faShareSquare}/></span>
        </CopyToClipboard>
        <span onClick={onNewWindow}>New Window <FontAwesomeIcon icon={faExternalLinkAlt}/></span>
      </div>
    </div>
  );
};