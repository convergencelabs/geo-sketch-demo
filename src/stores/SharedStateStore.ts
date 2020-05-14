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
import {RemoteState} from "../models/RemoteState";

export abstract class SharedStateStore<M = any> {

  @observable
  public remoteStateMap: Map<string, RemoteState<M>>;

  @observable
  public localState: M;

  private _defaultLocalState: M;

  private readonly _stateKey: string;
  private _activity: Activity | null = null;

  protected constructor(stateKey: string, defaultLocalState: M) {
    this._stateKey = stateKey;
    this.remoteStateMap = new Map();
    this.localState = defaultLocalState;
    this._defaultLocalState = defaultLocalState;
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
  public get remoteState(): RemoteState<M>[] {
    return Array.from(this.remoteStateMap.values());
  }

  @action
  public setLocalState(value: M): void {
    this.localState = value;

    if (this._activity !== null) {
      this._activity.setState({[this._stateKey]: value});
    }
  }

  @action
  public clearLocalState(): void {
    this.localState = this._defaultLocalState;

    if (this._activity !== null) {
      this._activity.removeState(this._stateKey);
    }
  }

  @action
  public setRemoteState(sessionId: string, remoteState: RemoteState<M>): void {
    this.remoteStateMap.set(sessionId, remoteState);
  }

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

  private _createModel(participant: ActivityParticipant): RemoteState<M> {
    const state = participant.state.get(this._stateKey);
    return new RemoteState<M>(participant.user, participant.sessionId, state);
  }
}
