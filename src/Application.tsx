import { useContext } from "react";
import SocketContext from "./socketContext";

interface IApplicationProps {}

const Application: React.FunctionComponent<IApplicationProps> = (props) => {
  const { socket, uid, users } = useContext(SocketContext).SocketState;

  return (
    <div>
      <h2>Socket IO Info</h2>
      <p>
        Your user ID: <strong>{uid}</strong>
        <br />
        Users online: <strong>{users.length}</strong>
        <br />
        Socket ID: <strong>{socket?.id}</strong>
        <br />
      </p>
    </div>
  );
};

export default Application;
