import React, {HTMLAttributes, useEffect, useState} from "react";
import {io, Socket} from "socket.io-client";
import {EncounterDTO} from "../../../shared/interfaces/dto/Encounter.dto";
import {ClientToServer} from "../../../shared/interfaces/sockets/ClientToServer";
import {ServerToClient} from "../../../shared/interfaces/sockets/ServerToClient";
import Style from "./EncounterScene.module.scss";

function EncounterScene(props: EncounterSceneProps) {
  const {id, className, children, ...component_props} = props;
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  const [socket] = useState<Socket<ServerToClient, ClientToServer>>(io(`http://localhost:${process.env.NEXT_PUBLIC_PORT_BACKEND}`));
  const [encounter, setEncounter] = useState<EncounterDTO>();
  
  useEffect(
    () => {
      socket.on("connect", () => {
        console.log("Connected");
        socket.emit("game_start", id);
    
        socket.on("game_start", encounter => {
          setEncounter(encounter);
          console.log(encounter);
        });
      });
  
      return () => {
        socket.close();
      };
    },
    [socket]
  );
  
  return (
    <div {...component_props} className={classes.join(" ")}>
      {renderEncounter(encounter)}
    </div>
  );
}

function renderEncounter(encounter?: EncounterDTO) {
  if (!encounter) return null;
  
  return (
    <div>{encounter.id}</div>
  );
}

export interface EncounterSceneProps extends HTMLAttributes<HTMLDivElement> {
  id: string;
}

export default EncounterScene;
