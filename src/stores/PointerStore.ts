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
import {RemotePointer} from "../models/RemotePointer";
import {IPointerCoordinates} from "../models/IPointerCoordinates";
import {SharedStateStore} from "./SharedStateStore";

export class PointerStore extends SharedStateStore<RemotePointer, IPointerCoordinates> {

  constructor() {
    super("pointer");
  }

  protected _jsonToModel(participant: ActivityParticipant, jsonState: IPointerCoordinates): RemotePointer {
    return new RemotePointer(participant.user, participant.sessionId, jsonState);
  }
}
