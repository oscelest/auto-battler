import {Server, Socket} from "socket.io";
import {ClientToServer} from "../../shared/interfaces/sockets/ClientToServer";
import {ServerToClient} from "../../shared/interfaces/sockets/ServerToClient";

export module EncounterSocket {
  
  export function onConnection(this: Server<ClientToServer, ServerToClient>, socket: Socket<ClientToServer, ServerToClient>) {
    socket.on("game_start", onGameStart.bind(socket));
  }
  
  function onGameStart(this: Socket<ClientToServer, ServerToClient>, id: string) {
    this.emit("game_start", {id: id, unit_list: []});
  }
  
  
}
