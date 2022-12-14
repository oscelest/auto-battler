import {ModifierEntity} from "../../entities";
import PeriodicTriggerEntity from "../../entities/Trigger/PeriodicTriggerEntity";
import {EffectEventType, EncounterEventType} from "../../enums";
import EffectType from "../../enums/EffectType";
import Operation from "../../modules/Operation";
import {Encounter} from "../Battle";
import SkillEffect from "../Effect/SkillEffect";
import Trigger, {TriggerInitializer} from "./Trigger";

export default class PeriodicTrigger extends Trigger<PeriodicTriggerEntity> {

  public current_interval: number;

  constructor(initializer: PeriodicStatusEffectTriggerInitializer) {
    super(initializer);
    this.current_interval = initializer.current_interval ?? 0;

    this.effect.on(EffectEventType.EXPIRE, this.onEffectExpire);
    this.effect.unit.encounter.on(EncounterEventType.PROGRESS, this.onEncounterProgress);
  }

  private getModifierList(): ModifierEntity[] {
    const modifier_list = [...this.effect.entity.modifier_list] as ModifierEntity[];
    switch (this.effect.entity.type) {
      case EffectType.ENCOUNTER:
        return modifier_list;
      case EffectType.SKILL:
        const {skill_unit, entity: {skill}} = this.effect as SkillEffect;
        return [
          ...modifier_list,
          ...skill.modifier_list,
          ...skill_unit.getModifierList()
        ];
    }
  }

  private getSourceUnit() {
    switch (this.effect.entity.type) {
      case EffectType.ENCOUNTER:
        return undefined;
      case EffectType.SKILL:
        return (this.effect as SkillEffect).skill_unit;
    }
  }

  private onEffectExpire = () => {
    this.effect.off(EffectEventType.EXPIRE, this.onEffectExpire);
    this.effect.unit.encounter.off(EncounterEventType.PROGRESS, this.onEncounterProgress);
  };

  private onEncounterProgress = () => {
    if (this.entity.interval > 0) {
      this.current_interval += Encounter.tick_interval;
      if (this.current_interval < this.entity.interval) return;
      this.current_interval -= this.entity.interval;
    }

    for (let operation of this.entity.operation_list) {
      Operation.execute(operation, this.effect.unit, this.effect.source);
    }
  };

}

export interface PeriodicStatusEffectTriggerInitializer extends TriggerInitializer<PeriodicTriggerEntity> {
  current_interval?: number;
}
