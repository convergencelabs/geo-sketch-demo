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

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {GeoSketch} from './components/GeoSketch';
import * as serviceWorker from './serviceWorker';
import {ArcGisLoader} from "./utils/ArcGisLoader";
import {getDemoId} from "./utils/example-id.js";
import 'mobx-react-lite/batchingForReactDom';

const url = new URL(window.location.href);
const username = url.searchParams.get("username");
const demoId = getDemoId();

ArcGisLoader.init()
  .then(() => {
    ReactDOM.render(
      <GeoSketch demoId={demoId} urlUsername={username}/>
      ,
      document.getElementById('root')
    );
  });

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
