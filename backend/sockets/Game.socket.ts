import {Server, Socket} from "socket.io";
import {ClientToServer} from "../../shared/interfaces/sockets/ClientToServer";
import {ServerToClient} from "../../shared/interfaces/sockets/ServerToClient";
import {EncounterSocket} from "./Encounter.socket";

export module GameSocket {
  
  export function onConnection(this: Server<ClientToServer, ServerToClient>, socket: Socket<ClientToServer, ServerToClient>) {
    console.log(socket.handshake.auth.token);
    
    socket.on("getGameData", onGetGameData.bind(socket));
    socket.on("startEncounter", EncounterSocket.onEncounterStart.bind(socket));
  }
  
  function onGetGameData(this: Socket<ClientToServer, ServerToClient>) {
    // this.emit("getGameData", {id: v4()});
  }
}
