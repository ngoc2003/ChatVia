import { AppState } from "@stores";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Socket, io } from "socket.io-client";

import getConfig from "next/config";
const { publicRuntimeConfig } = getConfig();

const useSocket = () => {
  const socket = useRef<Socket>(
    io(publicRuntimeConfig.SOCKET_API, {
      transports: ["websocket"],
    })
  );
  const user = useSelector((state: AppState) => state.auth);

  useEffect(() => {
    if (user.id && socket?.current) {
      socket.current.emit("addUser", user.id);
      socket.current.on("getUsers ", () => {});
      socket.current.on("getConversation ", () => {});
    }
  }, [user.id]);

  return socket;
};

export default useSocket;
