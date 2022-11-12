import React, {HTMLAttributes} from "react";
import ColumnSection from "./ColumnSection";
import Style from "./ComboBar.module.scss";

function ProgressBar(props: ProgressBarProps) {
  const {column_left, column_right, current, max, background, className, children, ...component_props} = props;

  const classes = [Style.Component];
  if (className) classes.push(className);

  return (
    <div {...component_props} className={classes.join(" ")}>
      <div className={Style.Background}>
        {renderBackground()}
      </div>
      <ColumnSection className={Style.Text} children_left={column_left} children_right={column_right}>
        {children}
      </ColumnSection>
    </div>
  );

  function renderBackground() {
    const element_list = [] as React.ReactNode[];
    for (let i = 0; i < max; i++) {
      const style = {background: i < current ? background : "linear-gradient(to top, #141e30, #243b55)"} as React.CSSProperties;
      element_list.push(
        <div key={i} className={Style.BackgroundSegment} style={style}/>
      );
    }
    return element_list;
  }

}

export interface ProgressBarProps extends HTMLAttributes<HTMLDivElement> {
  current: number;
  max: number;
  background: string;
  column_left?: React.ReactNode;
  column_right?: React.ReactNode;
}

export default ProgressBar;
