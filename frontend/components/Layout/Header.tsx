import {Button} from "@noxy/react-button";
import React, {HTMLAttributes, useContext} from "react";
import {v4} from "uuid";
import {SiteContext} from "../../pages/_app";
import Style from "./Header.module.scss";

function Header(props: HeaderProps) {
  const {socket, user, setUser} = useContext(SiteContext);
  const {children, className, ...component_props} = props;
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")}>
      {
        !user
        ? <Button onClick={logIn}>Log In</Button>
        : <Button onClick={logOut}>Log Out</Button>
      }
    </div>
  );
  
  function logIn() {
    const id = v4();
    setUser({username: "Admin", id: v4()});
    socket.auth = {token: id};
    socket.open();
  }
  
  function logOut() {
    socket.close();
    setUser(undefined);
  }
}

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {
  children?: never;
}

export default Header;
