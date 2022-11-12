import React, {HTMLAttributes} from "react";
import ColumnSection from "./ColumnSection";
import Style from "./ProgressBar.module.scss";

function ProgressBar(props: ProgressBarProps) {
  const {column_left, column_right, percent, background, className, children, ...component_props} = props;

  const classes = [Style.Component];
  if (className) classes.push(className);

  const background_style = {right: `${100 - percent}%`, background};

  return (
    <div {...component_props} className={classes.join(" ")}>
      <div className={Style.Background} style={background_style}/>
      <ColumnSection className={Style.Text} children_left={column_left} children_right={column_right}>
        {children}
      </ColumnSection>
    </div>
  );

}

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  percent: number;
  background: string;
  column_left?: React.ReactNode;
  column_right?: React.ReactNode;
}

export default ProgressBar;
