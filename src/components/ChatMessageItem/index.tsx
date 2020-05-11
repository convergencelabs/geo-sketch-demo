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

import React from "react";
import styles from "./styles.module.css";
import {ChatMessage} from "../../models/ChatMessage";
import moment from "moment";
import {colorAssigner} from "../../utils/color-util";

export interface IChatMessageProps {
  message: ChatMessage;
  online: boolean;
}

export const ChatMessageItem = (props: IChatMessageProps) => {
  const {message, online} = props;

  const timestamp = moment(message.timestamp).format("hh:mma");

  const additionalStyles = online ?
    {borderColor: colorAssigner.getColorAsHex(message.user.userId.toGuid())}
    : {};

  return (
    <div className={styles.chatMessage}>
      <div className={styles.meta}>
        <span className={styles.username} style={additionalStyles}>{message.user.displayName}</span>
        <span className={styles.timestamp}>{timestamp}</span>
      </div>
      <div className={styles.content}>{message.message}</div>
    </div>
  );
};
