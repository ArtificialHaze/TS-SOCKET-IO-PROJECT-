import React, {
  PropsWithChildren,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  defaultSocketContextState,
  SocketContextProvider,
  SocketReducer,
} from "./socketContext";
import { useSocket } from "./useSocket";

export interface ISocketContextComponentProps extends PropsWithChildren {}

const SocketContextComponent: React.FunctionComponent<
  ISocketContextComponentProps
> = (props) => {
  const { children } = props;

  const [SocketState, SocketDispatch] = useReducer(
    SocketReducer,
    defaultSocketContextState
  );
  const [isLoading, setIsLoading] = useState(true);

  const socket = useSocket("ws://localhost:1337", {
    reconnectionAttempts: 5,
    reconnectionDelay: 5000,
    autoConnect: false,
  });

  useEffect(() => {
    socket.connect();

    SocketDispatch({ type: "update_socket", payload: socket });
    StartListeners();
    SendHandShake();
  }, []);

  const StartListeners = () => {
    socket.on("user_connected", (users: string[]) => {
      console.info("User connected.");
      SocketDispatch({ type: "update_users", payload: users });
    });

    socket.on("user_disconnected", (uid: string) => {
      console.info("User disconnected.");
      SocketDispatch({ type: "remove_user", payload: uid });
    });

    socket.io.on("reconnect", (attempt) => {
      console.info("Reconnected on attempt:" + attempt);
    });

    socket.io.on("reconnect_attempt", (attempt) => {
      console.info("Reconnection attempt:" + attempt);
    });

    socket.io.on("reconnect_error", (error) => {
      console.info("Reconnected error:" + error);
    });

    socket.io.on("reconnect_failed", () => {
      console.info("Connection failure ");
      alert("Unable to connect you to the web");
    });
  };

  const SendHandShake = () => {
    console.info("Sending handshake to server..");

    socket.emit("handshake", (uid: string, users: string[]) => {
      console.log("User handshake callback message received.");
      SocketDispatch({ type: "update_uid", payload: uid });
      SocketDispatch({ type: "update_users", payload: users });

      setIsLoading(false);
    });
  };

  if (isLoading) return <p>Loading..</p>;

  return (
    <SocketContextProvider value={{ SocketState, SocketDispatch }}>
      {children}
    </SocketContextProvider>
  );
};

export default SocketContextComponent;
