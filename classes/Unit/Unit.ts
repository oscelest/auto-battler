import HumanizeDuration from "humanize-duration";
import {EffectEntity, ModifierEntity, SkillEntity, UnitEntity} from "../../entities";
import {UnitEventType} from "../../enums";
import DamageElementType from "../../enums/Encounter/Damage/DamageElementType";
import DamageSourceType from "../../enums/Encounter/Damage/DamageSourceType";
import ModifierCategoryType from "../../enums/Encounter/Modifier/ModifierCategoryType";
import SourceType from "../../enums/Encounter/SourceType";
import UnitAlignmentType from "../../enums/Encounter/Unit/UnitAlignmentType";
import UnitAttributeType from "../../enums/Encounter/Unit/UnitAttributeType";
import Modifier from "../../modules/Modifier";
import {EntityEventElement} from "../Base";
import {EntityEventElementInitializer} from "../Base/EntityEventElement";
import {Effect} from "../Effect";
import {EffectInitializer} from "../Effect/Effect";
import Encounter from "../Encounter/Encounter";
import {Skill} from "../Skill";
import {SkillInitializer} from "../Skill/Skill";
import Source from "../Source/Source";

export default class Unit extends EntityEventElement<UnitEntity, UnitEventHandler> {
  
  public health: number;
  public alignment: UnitAlignmentType;
  
  public readonly reference: Source<SourceType.UNIT>;
  public readonly encounter: Encounter;
  public readonly skill_list: Skill[];
  public readonly effect_list: Effect[];
  
  constructor(initializer: UnitInitializer) {
    super(initializer);
    
    this.reference = new Source({type: SourceType.UNIT, value: this});
    this.encounter = initializer.encounter;
    this.skill_list = (initializer.skill_list ?? initializer.entity.skill_list)?.map(entity => Skill.instantiate(entity instanceof SkillEntity ? {unit: this, entity} : entity)) ?? [];
    this.effect_list = initializer.effect_list?.map(initializer => new Effect(initializer)) ?? [];
    
    this.health = initializer.health ?? this.getAttributeValue(UnitAttributeType.HEALTH);
    this.alignment = initializer.alignment;
    
    this.attachEvents();
    this.on(UnitEventType.KILLED, this.onUnitKilled);
    this.on(UnitEventType.REVIVE_RECEIVED, this.onUnitRevived);
  }
  
  public get alive(): boolean {
    return this.health > 0;
  }
  
  public get level(): number {
    return Math.max(1, Math.floor(1 + Math.max(0, this.entity.experience) / 100));
  }
  
  public get modifier_list(): ModifierEntity[] {
    return [
      ...this.entity.modifier_list,
      ...this.entity.class.modifier_list,
      ...this.effect_list.reduce(
        (result, status_effect) => [...result, ...status_effect.entity.modifier_list],
        [] as ModifierEntity[]
      )
    ];
  }
  
  public toString(): string {
    return this.entity.name;
  }
  
  public getAttributeValue(attribute: UnitAttributeType) {
    return Modifier.getCategoryValue(Modifier.convertAttributeToCategory(attribute), this.modifier_list, this);
  }
  
  public kill(target_unit: Unit, source: Source = this.reference) {
    if (!target_unit.alive) return;
    
    target_unit.die(source);
    if (target_unit !== this) this.trigger(UnitEventType.KILL, {target_unit, source});
  }
  
  public die(source: Source) {
    this.health = 0;
    this.trigger(UnitEventType.KILLED, {target_unit: this, source});
  }
  
  public applyDamageTo(target_unit: Unit, pre_mitigation_value: number, damage_source: DamageSourceType, damage_element: DamageElementType, direct: boolean, source: Source = this.reference): void {
    if (!target_unit.alive) return;
    
    const post_mitigation_value = target_unit.receiveDamageFrom(source, pre_mitigation_value, damage_source, damage_element, direct);
    if (post_mitigation_value > 0) {
      this.trigger(UnitEventType.DAMAGE_APPLIED, {source, target_unit, pre_mitigation_value, post_mitigation_value, damage_source, damage_element, direct});
    }
  }
  
  public receiveDamageFrom(source: Source, pre_mitigation_value: number, damage_source: DamageSourceType, damage_element: DamageElementType, direct: boolean): number {
    if (!this.alive) return 0;
    
    const armor = Modifier.getCategoryValue([ModifierCategoryType.UNIT_ATTRIBUTE_ARMOR], this.modifier_list, this);
    
    const post_mitigation_value = Math.min(pre_mitigation_value * (100 / (100 + armor)), this.health);
    this.health -= post_mitigation_value;
    
    if (post_mitigation_value > 0) {
      this.trigger(UnitEventType.DAMAGE_RECEIVED, {target_unit: this, source, pre_mitigation_value, post_mitigation_value, damage_source, damage_element, direct});
    }
    if (!this.alive) {
      this.die(source);
    }
    
    return post_mitigation_value;
  }
  
  public applyHealingTo(target_unit: Unit, pre_mitigation_value: number, reviving: boolean, source: Source = this.reference): void {
    const currently_alive = target_unit.alive;
    if (!currently_alive && !reviving) return;
    
    const post_mitigation_value = target_unit.receiveHealingFrom(source, pre_mitigation_value, reviving);
    if (!currently_alive && target_unit.alive) {
      this.trigger(UnitEventType.REVIVE_APPLIED, {source, target_unit});
    }
    if (post_mitigation_value > 0) {
      this.trigger(UnitEventType.HEALING_APPLIED, {source, target_unit, pre_mitigation_value, post_mitigation_value, reviving});
    }
  }
  
  public receiveHealingFrom(source: Source, pre_mitigation_value: number, reviving: boolean): number {
    if (!this.alive && !reviving) return 0;
    
    const modifier_list = this.modifier_list;
    const max_heath = Modifier.getCategoryValue(ModifierCategoryType.UNIT_ATTRIBUTE_HEALTH, modifier_list, this);
    const heal_modifier = Modifier.getCategoryValue(ModifierCategoryType.HEAL, modifier_list, this);
    
    const post_mitigation_value = Math.min(pre_mitigation_value + heal_modifier, max_heath - this.health);
    const revived = !this.alive && reviving && post_mitigation_value > 0;
    this.health += post_mitigation_value;
    
    if (revived) {
      this.trigger(UnitEventType.REVIVE_RECEIVED, {source, target_unit: this});
    }
    if (post_mitigation_value > 0) {
      this.trigger(UnitEventType.HEALING_RECEIVED, {source, target_unit: this, pre_mitigation_value, post_mitigation_value, reviving});
    }
    
    return post_mitigation_value;
  }
  
  public applyComboPointTo(target_unit: Unit, delta: number, chainable: boolean, source: Source = this.reference) {
    if (!target_unit.alive) return;
    
    target_unit.receiveComboPointFrom(source, delta, chainable);
    
    if (delta > 0) {
      this.trigger(UnitEventType.COMBO_POINT_APPLIED, {source, target_unit, delta, chainable});
    }
  }
  
  public receiveComboPointFrom(source: Source, delta: number, chainable: boolean) {
    if (!this.alive) return;
    
    if (delta > 0) {
      this.trigger(UnitEventType.COMBO_POINT_RECEIVED, {source, target_unit: this, delta, chainable});
    }
  }
  
  public applyEffectTo(target_unit: Unit, entity: EffectEntity, duration: number, source: Source = this.reference) {
    if (!target_unit.alive) return;
    
    const effect = new Effect({unit: target_unit, entity, duration, source});
    target_unit.receiveEffectFrom(source, effect);
    this.trigger(UnitEventType.EFFECT_APPLIED, {target_unit: this, source, effect});
  }
  
  public receiveEffectFrom(source: Source, effect: Effect) {
    this.effect_list.push(effect);
    this.trigger(UnitEventType.EFFECT_RECEIVED, {target_unit: this, source, effect});
  }
  
  private attachEvents() {
    this.on(UnitEventType.DAMAGE_RECEIVED, this.onDamageReceived);
    this.on(UnitEventType.HEALING_RECEIVED, this.onHealingReceived);
    this.on(UnitEventType.EFFECT_RECEIVED, this.onEffectReceived);
  }
  
  private detachEvents() {
    this.off(UnitEventType.DAMAGE_RECEIVED, this.onDamageReceived);
    this.off(UnitEventType.HEALING_RECEIVED, this.onHealingReceived);
    this.off(UnitEventType.EFFECT_RECEIVED, this.onEffectReceived);
  }
  
  private onUnitKilled = () => {
    this.detachEvents();
  };
  
  private onUnitRevived = () => {
    this.attachEvents();
  };
  
  private onDamageReceived = ({damage_element, damage_source, source, pre_mitigation_value, post_mitigation_value}: UnitDamageEvent) => {
    console.log("Damage taken from", source);
    this.encounter.log.writeEntry(source, `${source.unit} dealt ${post_mitigation_value} (← ${pre_mitigation_value}) ${damage_source} ${damage_element} damage to ${this}.`);
  };
  
  private onHealingReceived = ({source, pre_mitigation_value, post_mitigation_value}: UnitHealEvent) => {
    this.encounter.log.writeEntry(source, `${source.unit} heals ${post_mitigation_value} (← ${pre_mitigation_value}) damage from ${this}.`);
  };
  
  private onEffectReceived = ({source, effect}: UnitEffectEvent) => {
    this.encounter.log.writeEntry(source, `${source.unit} applies ${effect} to ${this} for ${HumanizeDuration(effect.duration)}.`);
  };
}

export interface UnitInitializer extends EntityEventElementInitializer<UnitEntity> {
  health?: number;
  alignment: UnitAlignmentType;
  
  encounter: Encounter;
  skill_list?: SkillInitializer[];
  effect_list?: EffectInitializer[];
}

export interface UnitKillEvent {
  source: Source;
  target_unit: Unit;
}

export interface UnitDamageEvent {
  target_unit: Unit;
  source: Source;
  pre_mitigation_value: number;
  post_mitigation_value: number;
  damage_source: DamageSourceType;
  damage_element: DamageElementType;
  direct: boolean;
}

export interface UnitHealEvent {
  target_unit: Unit;
  source: Source;
  pre_mitigation_value: number;
  post_mitigation_value: number;
  reviving: boolean;
}

export interface UnitComboPointEvent {
  target_unit: Unit;
  source: Source;
  delta: number;
  chainable: boolean;
}

export interface UnitEffectEvent {
  target_unit: Unit;
  source: Source;
  effect: Effect;
}

type UnitEventHandler = {
  [UnitEventType.KILL]: (event: UnitKillEvent) => void
  [UnitEventType.KILLED]: (event: UnitKillEvent) => void
  [UnitEventType.REVIVE_RECEIVED]: (event: UnitKillEvent) => void
  [UnitEventType.REVIVE_APPLIED]: (event: UnitKillEvent) => void
  [UnitEventType.DAMAGE_RECEIVED]: (event: UnitDamageEvent) => void
  [UnitEventType.DAMAGE_APPLIED]: (event: UnitDamageEvent) => void
  [UnitEventType.HEALING_RECEIVED]: (event: UnitHealEvent) => void
  [UnitEventType.HEALING_APPLIED]: (event: UnitHealEvent) => void
  [UnitEventType.COMBO_POINT_APPLIED]: (event: UnitComboPointEvent) => void
  [UnitEventType.COMBO_POINT_RECEIVED]: (event: UnitComboPointEvent) => void
  [UnitEventType.EFFECT_APPLIED]: (event: UnitEffectEvent) => void
  [UnitEventType.EFFECT_RECEIVED]: (event: UnitEffectEvent) => void
}
