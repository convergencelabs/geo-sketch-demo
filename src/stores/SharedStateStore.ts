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
  ActivitySessionLeftEvent,
  ActivityStateRemovedEvent,
  ActivityStateSetEvent
} from "@convergence/convergence";
import {action, computed, observable} from "mobx";

export abstract class SharedStateStore<M = any, J = any> {

  @observable
  public remoteStateMap: Map<string, M>;

  @observable
  public localState: J | null = null;

  private readonly _stateKey: string;
  private _activity: Activity | null = null;

  protected constructor(stateKey: string) {
    this._stateKey = stateKey;
    this.remoteStateMap = new Map();
  }

  @action
  public setActivity(activity: Activity): void {
    this._activity = activity;

    this._activity
      .participants()
      .filter(p => !p.local && p.state.has(this._stateKey))
      .forEach(p => {
        this.remoteStateMap.set(p.sessionId, this._createModel(p))
      });

    this._activity.events().subscribe(e => {
      if (e instanceof ActivityStateSetEvent && e.key === this._stateKey) {
        this._onUpdateState(e);
      } else if (e instanceof ActivityStateRemovedEvent && e.key === this._stateKey) {
        this._onRemoveState(e);
      } else if (e instanceof ActivitySessionJoinedEvent) {
        this._onUpdateState(e);
      } else if (e instanceof ActivitySessionLeftEvent) {
        this._onRemoveState(e);
      }
    });

    if (this.localState) {
      this.setLocalState(this.localState);
    }
  }

  @computed
  public get remoteState(): M[] {
    return Array.from(this.remoteStateMap.values());
  }

  @action
  public setLocalState(value: J): void {
    this.localState = value;

    if (this._activity !== null) {
      this._activity.setState({
        [this._stateKey]: value
      });
    }
  }

  @action
  public clearLocalState(): void {
    this.localState = null;

    if (this._activity !== null) {
      this._activity.removeState(this._stateKey);
    }
  }

  @action
  public setRemoteState(sessionId: string, remoteState: M): void {
    this.remoteStateMap.set(sessionId, remoteState);
  }

  protected abstract _jsonToModel(participant: ActivityParticipant, jsonState: J): M;

  private _onUpdateState = (e: ActivityStateSetEvent | ActivitySessionJoinedEvent) => {
    if (this._activity === null) {
      return;
    }

    const participant = this._activity.participant(e.sessionId);
    if (!participant.local && participant.state.has(this._stateKey)) {
      const newRemoteState = this._createModel(participant);
      this.setRemoteState(e.sessionId, newRemoteState);
    }
  };

  private _onRemoveState = (e: ActivitySessionLeftEvent | ActivityStateRemovedEvent) => {
    this.remoteStateMap.delete(e.sessionId);
  };

  private _createModel(participant: ActivityParticipant): M {
    const state = participant.state;
    const jsonState: J = state.get(this._stateKey);
    return this._jsonToModel(participant, jsonState);
  }
}
