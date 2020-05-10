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
import {PointerStore} from "./PointerStore";
import {ModelStore} from "./ModelStore";
import {ViewportStore} from "./ViewportStore";

export const pointerStore = new PointerStore();
export const viewportStore = new ViewportStore();
export const modelStore = new ModelStore();

export const storesContext = React.createContext({
  viewportStore,
  pointerStore,
  modelStore
});

export const useStores = () => React.useContext(storesContext);