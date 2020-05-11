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

import React, {useEffect, useRef, useState} from "react";
import styles from "./styles.module.css";
import {observer} from "mobx-react";
import {useStores} from "../../stores/stores";
import {ChatMessageItem} from "../ChatMessageItem";

export const ChatMessages = observer(() => {
  const {chatStore, participantStore} = useStores();
  const containerRef = useRef<HTMLDivElement>(null);
  const [messageCount, setMessageCount] = useState(0);

  useEffect(() => {
    if (messageCount < chatStore.messages.length) {
      const container = containerRef.current!;
      container.scrollTop = container.scrollHeight - container.clientHeight;
      setMessageCount(chatStore.messages.length);
    }
  }, [chatStore.messages.length, messageCount]);

  const participants = Array.from(participantStore.participants.values());

  const messages = chatStore.messages.map(m => {
    const online = participants.find(p => p.user.userId.equals(m.user.userId)) !== undefined;
    return <ChatMessageItem key={m.eventId} message={m} online={online}/>;
  });

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.chatMessages}>
        {messages}
      </div>
    </div>
  );
});
