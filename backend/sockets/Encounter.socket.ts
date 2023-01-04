import {Socket} from "socket.io";
import {ClientToServer} from "../../shared/interfaces/sockets/ClientToServer";
import {ServerToClient} from "../../shared/interfaces/sockets/ServerToClient";
import {Encounter} from "../classes";

export module EncounterSocket {
  
  export function onEncounterStart(this: Socket<ClientToServer, ServerToClient>) {
    this.data.encounter = new Encounter({});
    this.on("getEncounterData", getEncounterData.bind(this));
  }
  
  function getEncounterData(this: Socket<ClientToServer, ServerToClient>) {
  }
}
