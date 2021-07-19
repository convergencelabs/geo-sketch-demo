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
  Chat,
  ChatRoom,
  Convergence,
  IActivityJoinOptions,
  LogLevel
} from "@convergence/convergence";
import {GeoSketchDemoConfig} from "../constants/config";
import {IStores} from "../stores/stores";

Convergence.configureLogging({
  root: LogLevel.WARN
});

export class ConnectionManager {
  constructor(private demoId: string, private stores: IStores) {
  }

  public async connect(displayName: string): Promise<void> {
    const domain = await Convergence.connectAnonymously(GeoSketchDemoConfig.domainUrl, displayName);

    const options: IActivityJoinOptions = {
      autoCreate:{ephemeral: true, worldPermissions: ["join", "view_state", "set_state"] }
    };
    const activity = await domain.activities().join("demo-geosketch", this.demoId, options);
    this.stores.pointerStore.setActivity(activity);
    this.stores.viewportStore.setActivity(activity);
    this.stores.basemapStore.setActivity(activity);
    this.stores.participantStore.setActivity(activity);
    this.stores.sketchStore.setActivity(activity);

    const model = await domain.models().openAutoCreate({
      collection: "maps",
      id: this.demoId,
      data: () => {
        return {
          features: {}
        };
      },
      ephemeral: true
    });
    this.stores.modelStore.setModel(model);

    const roomId = await domain.chat().create({
      id: this.demoId,
      type: "room",
      membership: "public",
      ignoreExistsError: true
    });

    domain
      .chat()
      .join(roomId)
      .then((room: Chat) => {
        this.stores.chatStore.setChatRoom(room as ChatRoom);
      })
      .catch(e => {
        console.error("Error joining chat room", e);
      });
  }
}


