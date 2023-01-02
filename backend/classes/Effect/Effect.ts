import HumanizeDuration from "humanize-duration";
import {EffectEventType, EncounterEventType, SourceType, UnitEventType} from "../../enums";
import {EffectAlignmentType, EffectEntity, EffectExpirationType, ModifierEntity, TriggerEntity} from "../../gql/sdk";
import {EntityEventElement} from "../Base";
import {EntityEventElementInitializer} from "../Base/EntityEventElement";
import {Encounter} from "../Encounter";
import {Source} from "../Source";
import {Trigger} from "../Trigger";
import {isTriggerEntity, TriggerInitializer} from "../Trigger/Trigger";
import {Unit} from "../Unit";
import {UnitKillEvent} from "../Unit/Unit";

export default class Effect<Entity extends EffectEntity = EffectEntity> extends EntityEventElement<Entity, EffectEventHandler> {
  
  public duration: number;
  public duration_elapsed: number;
  
  public readonly reference: Source<SourceType.EFFECT>;
  public readonly source: Source;
  public readonly unit: Unit;
  public readonly trigger_list: Trigger[];
  
  constructor(initializer: EffectInitializer<Entity>) {
    super(initializer);
  
    this.duration = initializer.duration ?? 0;
    this.duration_elapsed = initializer.duration_elapsed ?? 0;
  
    this.reference = new Source({type: SourceType.EFFECT, value: this});
    this.source = initializer.source;
    this.unit = initializer.unit;
    this.trigger_list = initializer.trigger_list?.map(entity => Trigger.instantiate(isTriggerEntity(entity) ? {effect: this, entity} : entity))
      ?? initializer.entity.trigger_list.map(entity => Trigger.instantiate({effect: this, entity}));
  
    this.unit.encounter.log.writeBegin(this.reference);
  
    this.on(EffectEventType.EXPIRE, this.onExpire);
    this.unit.on(UnitEventType.DIED, this.onUnitDeath);
    this.unit.encounter.on(EncounterEventType.PROGRESS, this.onEncounterProgress);
  }
  
  public get modifier_list(): ModifierEntity[] {
    return [...this.entity.modifier_list];
  }
  
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
        [EffectAlignmentType.Positive]: [] as Effect[],
        [EffectAlignmentType.Neutral]: [] as Effect[],
        [EffectAlignmentType.Negative]: [] as Effect[]
      }
    );
  }
  
  public override toString() {
    return this.entity.name;
  }
  
  private onExpire = (event: EffectExpireEvent) => {
    this.off(EffectEventType.EXPIRE, this.onExpire);
    
    for (let i = this.unit.effect_list.length - 1; i >= 0; i--) {
      if (this.id === this.unit.effect_list[i].id) {
        this.unit.effect_list.splice(i, 1);
      }
    }
    
    this.unit.encounter.log.writeEnd(this.reference, `${this} ${this.getExpireString(event.expiration_type)} ${this.unit} after ${HumanizeDuration(this.duration)}.`);
  };
  
  private onUnitDeath = (event: UnitKillEvent) => {
    this.unit.off(UnitEventType.DIED, this.onUnitDeath);
  
    this.trigger(EffectEventType.EXPIRE, {effect: this, expiration_type: EffectExpirationType.Death});
  };
  
  private onEncounterProgress = () => {
    this.duration_elapsed += Encounter.tick_interval;
    
    if (!this.entity.expires) return;
    if (this.duration <= this.duration_elapsed) {
      this.trigger(EffectEventType.EXPIRE, {effect: this, expiration_type: EffectExpirationType.Duration});
    }
  };
  
  private getExpireString(type: EffectExpirationType) {
    switch (type) {
      case EffectExpirationType.Cleanse:
        return "was cleansed from";
      case EffectExpirationType.Death:
        return "was removed on death from";
      case EffectExpirationType.Dispel:
        return "was dispelled from";
      case EffectExpirationType.Duration:
        return "expired from";
    }
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
