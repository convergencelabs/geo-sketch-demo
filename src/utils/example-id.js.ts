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

import {createUUID} from "./uuid";

export function getDemoId() {
  const url = new URL(window.location.href);
  let id = url.searchParams.get('id');
  if (!id) {
    id = createUUID();
    url.searchParams.append('id', id);
    window.history.pushState({}, "", url.href);
  }
  return id;
}
