import {Button} from "@noxy/react-button";
import React, {HTMLAttributes, useContext} from "react";
import {SiteContext} from "../../pages/_app";
import Style from "./Login.module.scss";

function Login(props: LoginProps) {
  const {user} = useContext(SiteContext);
  const {id, className, children, ...component_props} = props;
  if (user) return children as JSX.Element;
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")}>
      <Button>Log In</Button>
      <Button>Sign up</Button>
    </div>
  );
}

export interface LoginProps extends HTMLAttributes<HTMLDivElement> {

}

export default Login;
