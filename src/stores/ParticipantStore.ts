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

import {
  Activity,
  ActivityParticipant,
  ActivitySessionJoinedEvent,
  ActivitySessionLeftEvent
} from "@convergence/convergence";
import {action, observable} from "mobx";
import {GeoSketchSessionUser} from "../models/GeoSketchSessionUser";
import {ParticipantAction} from "../models/ParticipantAction";

export class ParticipantStore {
  private _activity: Activity | null = null;

  @observable
  public participants: Map<string, GeoSketchSessionUser> = new Map();

  @observable
  public participantAction: ParticipantAction | null = null;

  @action
  public setActivity(activity: Activity): void {
    this._activity = activity;

    this._activity
      .participants()
      .forEach(p => this.participantJoined(p));

    this._activity.events().subscribe(e => {
      if (e instanceof ActivitySessionJoinedEvent) {
        this.participantJoined(e.participant);
      } else if (e instanceof ActivitySessionLeftEvent) {
        this.participantLeft(e.sessionId);
      }
    });
  }

  @action
  public setParticipantAction(action: ParticipantAction | null): void {
    this.participantAction = action;
  }

  @action
  public participantJoined(p: ActivityParticipant): void {
    const participant = new GeoSketchSessionUser(p.user, p.sessionId, p.local);
    this.participants.set(participant.sessionId, participant);
  }

  @action
  public participantLeft(sessionId: string): void {
    this.participants.delete(sessionId);
    if (this.participantAction !== null && this.participantAction.participant.sessionId === sessionId) {
      this.participantAction = null;
    }
  }
}
