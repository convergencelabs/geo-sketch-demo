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
  RangeReference,
  RealTimeString,
  ReferenceSetEvent,
  RemoteReferenceCreatedEvent,
  StringInsertEvent,
  StringRemoveEvent
} from "@convergence/convergence";
import React, {useEffect, useRef} from "react";
import "@convergence/html-text-collab-ext/css/html-text-collab-ext.css";
import {colorAssigner} from "../../utils/color-util";
import styles from "./styles.module.css";
import {CollaborativeTextArea} from "@convergence/html-text-collab-ext";

export interface ICollaborativeTextarea {
  stringModel: RealTimeString;
  onChange: (value: string) => void;
}

export const SharedTextArea = (props: ICollaborativeTextarea) => {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const {stringModel} = props;

  useEffect(() => {

    const localReference = stringModel.rangeReference("selection");

    const textarea = taRef.current!;

    // Set the initial data, and set the cursor to the beginning.
    textarea.value = props.stringModel.value();
    textarea.selectionStart = 0;
    textarea.selectionEnd = 0;

    textarea.addEventListener("blur", () => {
      if (localReference.isShared()) {
        localReference.unshare();
      }
    });

    textarea.addEventListener("focus", () => {
      sendLocalSelection();
      if (!localReference.isShared()) {
        localReference.share();
      }
    });

    // Create the editor and set up two way data binding.
    const textEditor = new CollaborativeTextArea({
      control: textarea,
      onInsert: (index: number, value: string) => stringModel.insert(index, value),
      onDelete: (index: number, length: number) => stringModel.remove(index, length),
      onSelectionChanged: sendLocalSelection
    });

    function sendLocalSelection() {
      const selection = textEditor.selectionManager().getSelection();
      localReference!.set({start: selection.anchor, end: selection.target});
    }

    const addSelection = (reference: RangeReference) => {
      const color = colorAssigner.getColorAsHex(reference.user().userId.toGuid());

      const remoteRange = reference.value();

      const selectionManager = textEditor!.selectionManager();

      selectionManager.addCollaborator(
        reference.sessionId(),
        reference.user().displayName!,
        color,
        {anchor: remoteRange.start, target: remoteRange.end});

      reference.on("cleared", () => selectionManager.removeCollaborator(reference.sessionId()));
      reference.on("disposed", () => selectionManager.removeCollaborator(reference.sessionId()));
      reference.on("set", (e) => {
        if (e instanceof ReferenceSetEvent) {
          const selection = reference.value();
          const collaborator = selectionManager.getCollaborator(reference.sessionId());
          collaborator.setSelection({anchor: selection.start, target: selection.end});
          if (!e.synthetic) {
            collaborator.flashCursorToolTip(2);
          }
        }
      });
    };

    const stringEvents = stringModel.events().subscribe((e) => {
      if (e instanceof StringInsertEvent) {
        textEditor.insertText(e.index, e.value)
      } else if (e instanceof StringRemoveEvent) {
        textEditor.deleteText(e.index, e.value.length)
      }
    });

    const references = stringModel.references({key: "selection"});
    references.forEach((reference) => {
      if (!reference.isLocal()) {
        addSelection(reference);
      }
    });

    sendLocalSelection();

    const newReference = stringModel.events().subscribe( (e) => {
      if (e instanceof RemoteReferenceCreatedEvent && e.reference.key() === "selection") {
        addSelection(e.reference);
      }
    });

    return () => {
      localReference.unshare();
      newReference.unsubscribe();
      stringEvents.unsubscribe();
    }
    // eslint-disable-next-line
  }, [stringModel]);

  return <textarea className={styles.collabTextArea} ref={taRef}/>;
};
