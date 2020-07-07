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

import {ChatHistoryEntry, ChatMessageEvent, ChatRoom, MessageChatHistoryEntry} from "@convergence/convergence";
import {action, observable} from "mobx";
import {ChatMessage} from "../models/ChatMessage";

export class ChatStore {
  private _room: ChatRoom | null = null;

  @observable
  public messages: ChatMessage[] = [];

  @action
  public setChatRoom(room: ChatRoom): void {
    this._room = room;

    this._room
      .getHistory({
        limit: 25,
        forward: false,
        eventFilter: ["message"]
      })
      .then(result => {
        result.data.forEach(e => this.prependHistoryEntry(e));
      })
      .catch(e => {
        console.error(e);
      });

    this._room.events().subscribe(e => {
      if (e instanceof ChatMessageEvent) {
        this.appendChatMessage(new ChatMessage(e.user, e.eventNumber, e.timestamp, e.message));
      }
    });
  }

  @action
  public appendChatMessage(e: ChatMessage): void {
    this.messages.push(e);
  }

  @action
  public prependHistoryEntry(entry: ChatHistoryEntry): void {
    if (entry instanceof MessageChatHistoryEntry) {
      this.messages.unshift(new ChatMessage(entry.user, entry.eventNumber, entry.timestamp, entry.message));
    }
  }

  @action
  public sedMessage(message: string): void {
    if (this._room) {
      this._room.send(message).catch(e => console.error())
    }
  }
}
