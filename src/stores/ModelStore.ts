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
  ReferenceSetEvent,
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

    this.model.events().subscribe(re => {
      if (re instanceof RemoteReferenceCreatedEvent && re.reference.key() === "selection") {
        this._handleNewReference(re.reference as ElementReference);
      }
    });

    model.references({key: "selection"}).forEach(r => {
      this._handleNewReference(r as ElementReference);
    });
  }

  @action
  public setLocalSelection(selection: RealTimeObject[]): void {
    if (this._selectionReference) {
      this._selectionReference?.set(selection);
    }
  }

  private _setReference(ref: ElementReference) {
    const selected = ref.values() as RealTimeObject[];
    const remoteSelection = new RemoteSelection(ref.user(), ref.sessionId(), selected);
    this.setRemoteSelection(ref.sessionId(), remoteSelection);
  }

  private _handleNewReference(ref: ElementReference): void {
    if (ref.isLocal()) {
      return;
    }

    const refSub = ref.events().subscribe(e => {
      if (e instanceof ReferenceSetEvent && e.src instanceof ElementReference) {
        this._setReference(ref as ElementReference);
      } else if (e instanceof ReferenceClearedEvent) {
        this.removeRemoteSelection(e.src.sessionId());
      } else if (e instanceof ReferenceDisposedEvent) {
        this.removeRemoteSelection(e.src.sessionId());
        refSub.unsubscribe();
      }
    });

    if (ref.isSet()) {
      this._setReference(ref as ElementReference);
    }
  }
}
