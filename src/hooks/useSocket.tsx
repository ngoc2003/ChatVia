import { AppState } from "@stores";
import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Socket, io } from "socket.io-client";

const useSocket = () => {
  const socket = useRef<Socket>(
    io("localhost:5000", {
      transports: ["websocket"],
    })
  );
  const user = useSelector((state: AppState) => state.auth);

  useEffect(() => {
    if (user.id && socket?.current) {
      socket.current.emit("addUser", user.id);
      socket.current.on("getUsers ", (users) => {
        console.log(users);
      });
      socket.current.on("getConversation ", (conversation) => {
        console.log(conversation);
      });
    }
  }, [user.id]);

  return socket;
};

export default useSocket;
