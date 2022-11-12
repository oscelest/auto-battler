import {HTMLAttributes} from "react";
import Style from "./Header.module.scss";

function Header(props: HeaderProps) {
  const {children, className, ...component_props} = props;

  const classes = [Style.Component];
  if (className) classes.push(className);

  return (
    <div {...component_props} className={classes.join(" ")}>{children}</div>
  );
}

export interface HeaderProps extends HTMLAttributes<HTMLDivElement> {

}

export default Header;
