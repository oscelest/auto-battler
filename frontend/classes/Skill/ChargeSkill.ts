import {EncounterEventType, SkillEventType, UnitEventType} from "../../enums";
import {ModifierCategoryType} from "../../generated/contract/enums/Modifier/ModifierCategoryType";
import {Encounter} from "../Encounter";
import Skill, {SkillInitializer} from "./Skill";

export default class ChargeSkill extends Skill {
  
  public charge_current: number;
  
  constructor(initializer: ChargeSkillInitializer) {
    super(initializer);
    this.charge_current = initializer.charge_current ?? 0;
    this.unit.encounter.on(EncounterEventType.PROGRESS, this.onEncounterProgress);
    this.unit.on(UnitEventType.DIED, this.onUnitKilled);
    this.unit.on(UnitEventType.REVIVE_RECEIVED, this.onUnitRevived);
  }
  
  private onEncounterProgress = () => {
    this.charge_current += Encounter.tick_interval;
    
    const skill_charge_max = this.getCategoryValue(ModifierCategoryType.CHARGE_SKILL_MAX);
    if (this.charge_current >= skill_charge_max) {
      this.charge_current -= skill_charge_max;
      this.trigger(SkillEventType.USE, {skill: this});
    }
  };
  
  private onUnitKilled = () => {
    this.unit.encounter.off(EncounterEventType.PROGRESS, this.onEncounterProgress);
  };
  
  private onUnitRevived = () => {
    
    this.unit.encounter.on(EncounterEventType.PROGRESS, this.onEncounterProgress);
  };
}

export interface ChargeSkillInitializer extends SkillInitializer {
  charge_current?: number;
}
