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

import {GeoSketchSessionUser} from "./GeoSketchSessionUser";

export enum ParticipantActionType {
  PREVIEW,
  GOTO,
  LINK
}

export class ParticipantAction {
  public static preview(participant: GeoSketchSessionUser): ParticipantAction {
    return new ParticipantAction(ParticipantActionType.PREVIEW, participant);
  }

  public static goto(participant: GeoSketchSessionUser): ParticipantAction {
    return new ParticipantAction(ParticipantActionType.GOTO, participant);
  }

  public static link(participant: GeoSketchSessionUser): ParticipantAction {
    return new ParticipantAction(ParticipantActionType.LINK, participant);
  }

  constructor(public actionType: ParticipantActionType,
                        public participant: GeoSketchSessionUser) {
    Object.freeze(this);
  }
}