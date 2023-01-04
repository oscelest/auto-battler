import React, {HTMLAttributes, useContext, useEffect} from "react";
import {SiteContext} from "../../pages/_app";
import Style from "./EncounterScene.module.scss";

function HomeScene(props: HomeSceneProps) {
  const {socket} = useContext(SiteContext);
  const {id, className, children, ...component_props} = props;
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  useEffect(
    () => {
      console.log("hello world");
      
    },
    [socket]
  );
  
  return (
    <div {...component_props} className={classes.join(" ")}>
      Hello world
    </div>
  );
}

export interface HomeSceneProps extends HTMLAttributes<HTMLDivElement> {

}

export default HomeScene;
