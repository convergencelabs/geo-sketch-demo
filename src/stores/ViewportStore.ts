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

import {ActivityParticipant} from "@convergence/convergence";
import {SharedStateStore} from "./SharedStateStore";
import {IViewportExtent} from "../models/IViewportExtent";
import {RemoteViewport} from "../models/RemoteViewport";

export class ViewportStore extends SharedStateStore<RemoteViewport, IViewportExtent> {

  constructor() {
    super("viewport");
  }

  protected _jsonToModel(participant: ActivityParticipant, jsonState: IViewportExtent): RemoteViewport {
    return new RemoteViewport(participant.user, participant.sessionId, jsonState);
  }
}
