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

export function getDemoId() {
  function createUUID() {
    let dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      // eslint-disable-next-line
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  const url = new URL(window.location.href);
  let id = url.searchParams.get('id');
  if (!id) {
    id = createUUID();
    url.searchParams.append('id', id);
    window.history.pushState({}, "", url.href);
  }
  return id;
}
