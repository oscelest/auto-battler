import React, {HTMLAttributes, useEffect, useState} from "react";
import {EncounterDTO} from "../../../shared/interfaces/dto/Encounter.dto";
import Style from "./EncounterScene.module.scss";

function EncounterScene(props: EncounterSceneProps) {
  const {id, className, children, ...component_props} = props;
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  const isBrowser = typeof window !== "undefined";
  
  const [socket, setSocket] = useState<WebSocket>();
  const [encounter] = useState<EncounterDTO>();
  
  useEffect(() => {
    if (!isBrowser) return;
    setSocket(new WebSocket(`ws://127.0.0.1:${process.env.NEXT_PUBLIC_PORT_BACKEND}`));
    
    return () => {
      if (!socket || socket.readyState === 3) return;
      socket?.close();
    };
  }, []);
  
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
