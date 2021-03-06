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

import React, {Context} from "react";
import {PointerStore} from "./PointerStore";
import {ModelStore} from "./ModelStore";
import {ViewportStore} from "./ViewportStore";
import {ParticipantStore} from "./ParticipantStore";
import {ChatStore} from "./ChatStore";
import {BasemapStore} from "./BasemapStore";
import {FormattingStore} from "./FormattingStore";
import {SketchStore} from "./SketchStore";

export const pointerStore = new PointerStore();
export const viewportStore = new ViewportStore();
export const basemapStore = new BasemapStore("f81bc478e12c4f1691d0d7ab6361f5a6");
export const modelStore = new ModelStore();
export const participantStore = new ParticipantStore();
export const chatStore = new ChatStore();
export const formattingStore = new FormattingStore();
export const sketchStore = new SketchStore();

export interface IStores {
  viewportStore: ViewportStore;
  pointerStore: PointerStore;
  sketchStore: SketchStore;
  basemapStore: BasemapStore;
  modelStore: ModelStore;
  participantStore: ParticipantStore;
  chatStore: ChatStore;
  formattingStore: FormattingStore;
}

export const storesContext: Context<IStores> = React.createContext({
  viewportStore,
  pointerStore,
  sketchStore,
  basemapStore,
  modelStore,
  participantStore,
  chatStore,
  formattingStore
});

export const useStores = () => React.useContext(storesContext);