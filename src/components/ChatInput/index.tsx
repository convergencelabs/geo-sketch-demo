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

import React, {KeyboardEvent, useRef} from "react";
import styles from "./styles.module.css";
import {useStores} from "../../stores/stores";

export const ChatInput = () => {
  const {chatStore} = useStores();
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.keyCode === 13 && !event.shiftKey && inputRef.current!.value !== "") {
      chatStore.sedMessage(inputRef.current!.value);
      inputRef.current!.value = "";
      event.preventDefault();
    }
  };

  return (
    <div className={styles.chatInput}>
        <textarea
          placeholder="Send Message"
          ref={inputRef}
          onKeyDown={handleKeyDown}
          rows={3}
        />
    </div>
  );
};
