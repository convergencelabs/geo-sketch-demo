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

import {ChatRoom, Convergence, LogLevel} from "@convergence/convergence";
import {PointerStore} from "../stores/PointerStore";
import {BasemapStore} from "../stores/BasemapStore";
import {GeoSketchDemoConfig} from "../constants/config";
import {ModelStore} from "../stores/ModelStore";
import {ViewportStore} from "../stores/ViewportStore";
import {ParticipantStore} from "../stores/ParticipantStore";
import {ChatStore} from "../stores/ChatStore";

Convergence.configureLogging({
  root: LogLevel.SILENT
});

export class ConnectionManager {
  constructor(private demoId: string,
              private viewportStore: ViewportStore,
              private pointerStore: PointerStore,
              private basemapStore: BasemapStore,
              private modelStore: ModelStore,
              private participantStore: ParticipantStore,
              private chatStore: ChatStore,
              ) {
  }

  public async connect(displayName: string): Promise<void> {
    const domain = await Convergence.connectAnonymously(GeoSketchDemoConfig.domainUrl, displayName);

    const activity = await domain.activities().join(this.demoId);
    this.pointerStore.setActivity(activity);
    this.viewportStore.setActivity(activity);
    this.basemapStore.setActivity(activity);
    this.participantStore.setActivity(activity);

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
    this.modelStore.setModel(model);

    const roomId = await domain.chat().create({
      id: this.demoId,
      type: "room",
      membership: "public",
      ignoreExistsError: true
    });

    const room = (await domain.chat().join(roomId)) as ChatRoom;

    this.chatStore.setChatRoom(room);
  }
}


