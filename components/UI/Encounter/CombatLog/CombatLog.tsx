import React, {HTMLAttributes, useEffect, useRef} from "react";
import {Log, LogSection} from "../../../../classes";
import Style from "./CombatLog.module.scss";
import CombatLogSection from "./CombatLogSection";

function CombatLog(props: CombatLogProps) {
  const {className, children, log, ...component_props} = props;
  const ref = useRef<HTMLDivElement>(null);
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  useEffect(
    () => {
      if (ref.current && ref.current.scrollTop === ref.current.scrollHeight) {
        ref.current.scrollTo({top: ref.current.scrollHeight});
      }
    },
    [log.log_section_list.length]
  );
  
  return (
    <div {...component_props} ref={ref} className={classes.join(" ")}>
      {log.log_section_list.map(renderLogSection)}
    </div>
  );
  
  function renderLogSection(section: LogSection, index: number = 0) {
    return (
      <CombatLogSection key={index}>{section}</CombatLogSection>
    );
  }
}

export interface CombatLogProps extends HTMLAttributes<HTMLDivElement> {
  log: Log;
}

export default CombatLog;
