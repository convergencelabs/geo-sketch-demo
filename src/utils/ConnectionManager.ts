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

import {Convergence} from "@convergence/convergence";
import {PointerStore} from "../stores/PointerStore";
import {GeoSketchDemoConfig} from "../constants/config";
import {ModelStore} from "../stores/ModelStore";
import {ViewportStore} from "../stores/ViewportStore";

export class ConnectionManager {
  constructor(private demoId: string, private viewportStore: ViewportStore, private pointerStore: PointerStore, private modelStore: ModelStore) {
  }

  public async connect(displayName: string): Promise<void> {
    const domain = await Convergence.connectAnonymously(GeoSketchDemoConfig.domainUrl, displayName);

    const activity = await domain.activities().join(this.demoId);
    this.pointerStore.setActivity(activity);
    this.viewportStore.setActivity(activity);

    const model = await domain.models().openAutoCreate({
      collection: "maps",
      id: this.demoId,
      data: () => {
        return {
          features: []
        };
      }
    });
    this.modelStore.setModel(model);
  }
}


