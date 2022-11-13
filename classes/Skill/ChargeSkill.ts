import {ChargeSkillEntity} from "../../entities";
import {EncounterEventType, SkillEventType, UnitEventType} from "../../enums";
import {Encounter} from "../Battle";
import Skill, {SkillInitializer} from "./Skill";

export default class ChargeSkill extends Skill<ChargeSkillEntity> {

  public charge_current: number;

  constructor(initializer: ChargeSkillInitializer) {
    super(initializer);
    this.charge_current = initializer.charge_current ?? 0;
    this.unit.encounter.on(EncounterEventType.PROGRESS, this.onEncounterProgress);
    this.unit.on(UnitEventType.KILLED, this.onUnitKilled);
    this.unit.on(UnitEventType.REVIVE_RECEIVED, this.onUnitRevived);
  }

  private onEncounterProgress = () => {
    this.charge_current += Encounter.tick_interval;
    if (this.charge_current > this.entity.charge_base) {
      this.charge_current -= this.entity.charge_base;
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

export interface ChargeSkillInitializer extends SkillInitializer<ChargeSkillEntity> {
  charge_current?: number;
}
