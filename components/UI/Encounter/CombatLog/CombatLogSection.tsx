import {Collapsible} from "@noxy/react-collapsible";
import React, {HTMLAttributes, useState} from "react";
import {LogSection} from "../../../../classes";
import Style from "./CombatLogSection.module.scss";

function CombatLogSection(props: CombatLogSectionProps) {
  const {className, children, subsection, ...component_props} = props;
  const [collapsed, setCollapsed] = useState<boolean>(false);
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")}>
      {renderContent(children)}
    </div>
  );
  
  function renderContent(content: LogSection, index: number = 0) {
    if (content.section_list.length) {
      const label = (
        <>
          <div className={Style.Icon}>{"\uea99"}</div>
          {renderTitle(children.title)}
        </>
      );
      
      return (
        <Collapsible key={index} className={Style.Collapsible} label={label} collapsed={collapsed} onClick={onClick}>
          {content.section_list.map(renderLogSection)}
        </Collapsible>
      );
    }
    
    return (
      <div className={Style.Text}>
        {renderSubsectionIcon(subsection)}
        {renderTitle(content.title, index)}
      </div>
    );
  }
  
  function onClick() {
    setCollapsed(!collapsed);
  }
  
}

function renderTitle(title: string, index: number = 0) {
  return (
    <span key={index} className={Style.Title}>{title}</span>
  );
}

function renderLogSection(section: LogSection, index: number = 0) {
  return (
    <CombatLogSection key={index} subsection={true}>{section}</CombatLogSection>
  );
}

function renderSubsectionIcon(flag?: boolean) {
  if (!flag) return null;
  
  return (
    <div className={Style.Icon}>{"\uea9b"}</div>
  );
}

export interface CombatLogSectionProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
  children: LogSection;
  subsection?: boolean;
}

export default CombatLogSection;
