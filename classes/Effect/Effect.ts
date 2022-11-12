import {EffectEntity} from "../../entities";
import {TriggerEntity} from "../../entities/Trigger";
import {EffectEventType, EncounterEventType, UnitEventType} from "../../enums";
import EffectType from "../../enums/EffectType";
import EffectExpirationType from "../../enums/StatusEffect/EffectExpirationType";
import StatusEffectAlignment from "../../enums/StatusEffect/StatusEffectAlignment";
import {EntityEventElement} from "../Base";
import {EntityEventElementInitializer} from "../Base/EntityEventElement";
import Encounter from "../Battle/Encounter";
import Source from "../Source";
import {Trigger} from "../Trigger";
import {TriggerInitializer} from "../Trigger/Trigger";
import {Unit} from "../Unit";
import {UnitKillEvent} from "../Unit/Unit";
import EncounterEffect, {EncounterEffectInitializer} from "./EncounterEffect";
import SkillEffect, {SkillEffectInitializer} from "./SkillEffect";

export default abstract class Effect<Entity extends EffectEntity = EffectEntity> extends EntityEventElement<Entity, EffectEventHandler> {

  public duration: number;
  public duration_elapsed: number;

  public readonly source: Source;
  public readonly unit: Unit;
  public readonly trigger_list: Trigger[];

  protected constructor(initializer: EffectInitializer<Entity>) {
    super(initializer);

    this.duration = initializer.duration ?? 0;
    this.duration_elapsed = initializer.duration_elapsed ?? 0;

    this.source = initializer.source;
    this.unit = initializer.unit;
    this.trigger_list = initializer.trigger_list?.map(entity => Trigger.instantiate(entity instanceof TriggerEntity ? {entity, effect: this} : entity)) ?? [];

    this.unit.on(UnitEventType.KILLED, this.onUnitDeath);
    this.unit.encounter.on(EncounterEventType.PROGRESS, this.onEncounterProgress);
  }

  public static instantiate(initializer: EffectInitializer) {
    switch (initializer.entity.type) {
      case EffectType.ENCOUNTER:
        return new SkillEffect(initializer as SkillEffectInitializer);
      case EffectType.SKILL:
        return new EncounterEffect(initializer as EncounterEffectInitializer);
    }
  }

  public toString() {
    return this.entity.name;
  }

  private onUnitDeath = ({target_unit}: UnitKillEvent) => {
    this.unit.off(UnitEventType.KILLED, this.onUnitDeath);
    for (let i = target_unit.effect_list.length; i >= 0; i++) {
      if (this === target_unit.effect_list[i]) {
        target_unit.effect_list.splice(i, 1);
      }
    }
    this.trigger(EffectEventType.EXPIRE, {effect: this, expiration_type: EffectExpirationType.DEATH});
  };

  private onEncounterProgress = () => {
    this.duration_elapsed += Encounter.tick_interval;

    if (!this.entity.expires) return;
    this.duration -= Encounter.tick_interval;
    if (this.duration <= 0) {
      this.trigger(EffectEventType.EXPIRE, {effect: this, expiration_type: EffectExpirationType.DURATION});
    }
  };

  public static getStatusEffectStackCollection(list: Effect[] = []) {
    return list.reduce(
      (result, value) => {
        if (!result[value.entity.name]) result[value.entity.name] = [];
        result[value.entity.name].push(value);
        return result;
      },
      {} as {[key: string]: Effect[]}
    );
  }

  public static getStatusEffectAlignmentCollection(list: Effect[] = []) {
    return list.reduce(
      (result, value) => {
        result[value.entity.alignment].push(value);
        return result;
      },
      {
        [StatusEffectAlignment.POSITIVE]: [] as Effect[],
        [StatusEffectAlignment.NEUTRAL]: [] as Effect[],
        [StatusEffectAlignment.NEGATIVE]: [] as Effect[]
      }
    );
  }
}

export interface EffectInitializer<Entity extends EffectEntity = EffectEntity> extends EntityEventElementInitializer<Entity> {
  duration?: number;
  duration_elapsed?: number;

  source: Source;
  unit: Unit;
  trigger_list?: (TriggerEntity | TriggerInitializer)[];
}

export interface EffectExpireEvent {
  effect: Effect;
  expiration_type: EffectExpirationType;
}

type EffectEventHandler = {
  [EffectEventType.EXPIRE]: (event: EffectExpireEvent) => void
}
