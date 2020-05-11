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

import {DomainUser} from "@convergence/convergence";

export class GeoSketchSessionUser {
  constructor(public readonly user: DomainUser, public readonly sessionId: string, local: boolean) {
    Object.freeze(this);
  }
}
