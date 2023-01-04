import React, {HTMLAttributes, useContext, useEffect, useState} from "react";
import {EncounterDTO} from "../../../shared/interfaces/dto/Encounter.dto";
import {SiteContext} from "../../pages/_app";
import Style from "./EncounterScene.module.scss";

function EncounterScene(props: EncounterSceneProps) {
  const {socket} = useContext(SiteContext);
  const {id, className, children, ...component_props} = props;
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  const [encounter, setEncounter] = useState<EncounterDTO>();
  
  useEffect(
    () => {
      socket.on("disconnect", () => {
        console.log("rip");
      });
  
      socket.once("connect", () => {
        socket.emit("startEncounter");
    
        socket.on("startEncounter", encounter => {
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
