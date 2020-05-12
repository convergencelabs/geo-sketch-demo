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
  ElementReference,
  LocalElementReference,
  RealTimeModel,
  RealTimeObject,
  ReferenceChangedEvent,
  ReferenceClearedEvent,
  ReferenceDisposedEvent,
  RemoteReferenceCreatedEvent
} from "@convergence/convergence";
import {action, observable} from "mobx";
import {RemoteSelection} from "../models/RemoteSelection";

export class ModelStore {

  private _selectionReference: LocalElementReference | null = null;

  @observable
  public model: RealTimeModel | null = null;

  @observable
  public remoteSelectionMap: Map<string, RemoteSelection> = new Map();

  @observable
  public remoteSelections: RemoteSelection[] = [];

  @action
  public setRemoteSelection(sessionId: string, remoteSelection: RemoteSelection) {
    this.remoteSelectionMap.set(sessionId, remoteSelection);
    this.remoteSelections.length = 0;
    this.remoteSelections.push(...Array.from(this.remoteSelectionMap.values()));
  }

  @action
  public removeRemoteSelection(sessionId: string) {
    this.remoteSelectionMap.delete(sessionId);
    this.remoteSelections.length = 0;
    this.remoteSelections.push(...Array.from(this.remoteSelectionMap.values()));
  }

  @action
  public setModel(model: RealTimeModel): void {
    this.model = model;

    this._selectionReference = this.model.elementReference("selection");
    this._selectionReference.set([]);
    this._selectionReference.share();

    this.model.on(RealTimeModel.Events.REFERENCE, e => {
      const re = e as RemoteReferenceCreatedEvent;
      if (re.reference.key() !== "selection") {
        return;
      }

      const ref = re.reference;
      const refSub = ref.events().subscribe(e => {
        if (e instanceof ReferenceChangedEvent && e.src instanceof ElementReference) {
          const selected = e.src.values() as RealTimeObject[];
          const remoteSelection = new RemoteSelection(e.src.user(), e.src.sessionId(), selected);
          this.setRemoteSelection(e.src.sessionId(), remoteSelection);
        } else if (e instanceof ReferenceClearedEvent) {
          this.removeRemoteSelection(e.src.sessionId());
        } else if (e instanceof ReferenceDisposedEvent) {
          this.removeRemoteSelection(e.src.sessionId());
          refSub.unsubscribe();
        }
      });
    });
  }

  public setLocalSelection(selection: RealTimeObject[]): void {
    if (this._selectionReference) {
      this._selectionReference?.set(selection);
    }
  }
}
