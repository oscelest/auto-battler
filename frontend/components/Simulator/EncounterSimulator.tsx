import React, {HTMLAttributes} from "react";
import EncounterScene from "../Scene/EncounterScene";
import Style from "./EncounterSimulator.module.scss";

function EncounterSimulator(props: EncounterSimulatorProps) {
  const {className, children, ...component_props} = props;
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  
  return (
    <div {...component_props} className={classes.join(" ")}>
      <EncounterScene id={"test"}></EncounterScene>
    </div>
  );
}


export interface EncounterSimulatorProps extends HTMLAttributes<HTMLDivElement> {

}

export default EncounterSimulator;
