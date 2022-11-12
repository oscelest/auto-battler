import {EncounterEffectEntity, ModifierEntity, SkillEntity, UnitEntity} from "../../entities";
import {UnitEventType} from "../../enums";
import DamageElementType from "../../enums/Damage/DamageElementType";
import DamageSourceType from "../../enums/Damage/DamageSourceType";
import ModifierCategory from "../../enums/Modifier/ModifierCategory";
import SourceType from "../../enums/SourceType";
import UnitAlignmentType from "../../enums/Unit/UnitAlignmentType";
import UnitAttributeType from "../../enums/Unit/UnitAttributeType";
import Modifier from "../../modules/Modifier";
import {EntityEventElement} from "../Base";
import {EntityEventElementInitializer} from "../Base/EntityEventElement";
import Encounter from "../Battle/Encounter";
import {Effect} from "../Effect";
import {EffectInitializer} from "../Effect/Effect";
import EncounterEffect from "../Effect/EncounterEffect";
import {Skill} from "../Skill";
import {SkillInitializer} from "../Skill/Skill";
import Source from "../Source";

export default class Unit extends EntityEventElement<UnitEntity, UnitEventHandler> {

  public health: number;
  public alignment: UnitAlignmentType;

  public readonly encounter: Encounter;
  public readonly skill_list: Skill[];
  public readonly effect_list: Effect[];

  constructor(initializer: UnitInitializer) {
    super(initializer);

    this.health = initializer.health ?? this.getAttributeValue(UnitAttributeType.HEALTH);
    this.alignment = initializer.alignment;

    this.encounter = initializer.encounter;
    this.skill_list = initializer.skill_list?.map(entity => Skill.instantiate(entity instanceof SkillEntity ? {unit: this, entity} : entity)) ?? [];
    this.effect_list = initializer.effect_list?.map(initializer => Effect.instantiate(initializer)) ?? [];
  }

  public toString(): string {
    return this.entity.name;
  }

  public asSource(): Source<SourceType.UNIT> {
    return new Source({type: SourceType.UNIT, value: this});
  }

  public get alive(): boolean {
    return this.health <= 0;
  }

  public getLevel(): number {
    return Math.max(1, Math.floor(1 + Math.max(0, this.entity.experience) / 100));
  }

  public getAttributeValue(attribute: UnitAttributeType) {
    return Modifier.getCategoryValue(Modifier.fromAttributeToCategoryMap[attribute], this.getModifierList(), this);
  }

  public getModifierList(): ModifierEntity[] {
    return [
      ...this.entity.modifier_list,
      ...this.entity.class.modifier_list,
      ...this.effect_list.reduce(
        (result, status_effect) => [...result, ...status_effect.entity.modifier_list],
        [] as ModifierEntity[]
      )
    ];
  }

  public kill(target_unit: Unit) {
    if (!target_unit.alive) return;

    const source = new Source({type: SourceType.UNIT, value: this});
    target_unit.die(source);
    if (target_unit !== this) this.trigger(UnitEventType.KILL, {target_unit, source});
  }

  public die(source: Source) {
    this.health = 0;
    this.trigger(UnitEventType.KILLED, {target_unit: this, source});
  }

  public applyDamageTo(target_unit: Unit, pre_mitigation_value: number, damage_source: DamageSourceType, damage_element: DamageElementType, direct: boolean) {
    if (!target_unit.alive) return 0;

    const source = this.asSource();
    const post_mitigation_value = target_unit.receiveDamageFrom(source, pre_mitigation_value, damage_source, damage_element, direct);
    if (direct && post_mitigation_value > 0) {
      this.trigger(UnitEventType.DAMAGE_APPLIED, {source, target_unit, pre_mitigation_value, post_mitigation_value, damage_source, damage_element, direct});
    }
    return post_mitigation_value;
  }

  public receiveDamageFrom(source: Source, pre_mitigation_value: number, damage_source: DamageSourceType, damage_element: DamageElementType, direct: boolean) {
    if (!this.alive) return 0;

    const armor = Modifier.getCategoryValue([ModifierCategory.UNIT_ATTRIBUTE_ARMOR], this.getModifierList(), this);

    const post_mitigation_value = Math.min(pre_mitigation_value * (100 / (100 + armor)), this.health);
    ;
    this.health -= post_mitigation_value;

    if (direct && post_mitigation_value > 0) {
      this.trigger(UnitEventType.DAMAGE_RECEIVED, {target_unit: this, source, pre_mitigation_value, post_mitigation_value, damage_source, damage_element, direct});
    }
    if (!this.alive) {
      this.die(source);
    }

    return post_mitigation_value;
  }

  public applyHealingTo(target_unit: Unit, pre_mitigation_value: number, reviving: boolean) {
    const alive = target_unit.alive;
    if (!alive && !reviving) return 0;

    const source = this.asSource();
    const post_mitigation_value = target_unit.receiveHealingFrom(source, pre_mitigation_value, reviving);

    if (!alive && target_unit.alive) {
      this.trigger(UnitEventType.REVIVING, {source, target_unit});
    }
    if (post_mitigation_value > 0) {
      this.trigger(UnitEventType.HEALING_RECEIVED, {source, target_unit, pre_mitigation_value, post_mitigation_value, reviving});
    }

    return post_mitigation_value;
  }

  public receiveHealingFrom(source: Source, pre_mitigation_value: number, reviving: boolean) {
    if (!this.alive && !reviving) return 0;

    const max_heath = Modifier.getCategoryValue(ModifierCategory.UNIT_ATTRIBUTE_HEALTH, this.getModifierList(), this);
    const heal_modifier = Modifier.getCategoryValue(ModifierCategory.HEAL, this.getModifierList(), this);

    const post_mitigation_value = Math.min(pre_mitigation_value + heal_modifier, max_heath - this.health);
    const revived = !this.alive && reviving && post_mitigation_value > 0;
    this.health += post_mitigation_value;

    if (revived) {
      this.trigger(UnitEventType.REVIVED, {source, target_unit: this});
    }
    if (post_mitigation_value > 0) {
      this.trigger(UnitEventType.HEALING_RECEIVED, {source, target_unit: this, pre_mitigation_value, post_mitigation_value, reviving});
    }

    return post_mitigation_value;
  }

  public applyComboPointTo(target_unit: Unit, pre_mitigation_value: number, chainable: boolean) {
    if (!target_unit.alive) return 0;

    const source = this.asSource();
    const post_mitigation_value = target_unit.receiveComboPointFrom(source, pre_mitigation_value, chainable);

    this.trigger(UnitEventType.COMBO_POINT_APPLIED, {source, target_unit, delta: post_mitigation_value, chainable});
  }

  public receiveComboPointFrom(source: Source, delta: number, chainable: boolean) {
    if (!this.alive) return 0;

    const combo_point_modifier = Modifier.getCategoryValue(ModifierCategory.COMBO_POINT_CHANGE, this.getModifierList(), this);
    const post_mitigation_value = delta + combo_point_modifier;

    if (post_mitigation_value > 0) {
      this.trigger(UnitEventType.COMBO_POINT_APPLIED, {source, target_unit: this, delta, chainable});
    }

    return post_mitigation_value;
  }

  public applyEffectTo(target_unit: Unit, entity: EncounterEffectEntity, source: Source, duration: number) {
    if (!target_unit.alive) return;

    target_unit.applyEffectFrom(source, new EncounterEffect({unit: target_unit, entity, duration, source}));
  }

  public applyEffectFrom(source: Source, effect: Effect) {
    this.effect_list.push(effect);
  }


  // public applyHealTo(value: number, target: Unit) {
  //   const max_health = this.getAttributeValue(UnitAttributeType.HEALTH);
  //   target.health = Math.min(target.health + value, max_health);
  //   return value;
  // }
  //
  // public applyStatusEffectTo(entity: EffectEntity, modifier_list: ModifierEntity[], target_unit: Unit, source_skill: Skill) {
  //   const duration = Modifier.getCategoryValue(ModifierCategory.STATUS_EFFECT_DURATION, modifier_list, this);
  //   const status_effect = new StatusEffect({
  //     entity, duration, source_skill,
  //     source_unit: this,
  //     onPeriodicStatusEffectTriggerActivate: this.onPeriodicEffectActivate,
  //     onExpire: this.onStatusEffectExpire
  //   });
  //
  //   this.effect_list.push(status_effect);
  //   return status_effect;
  // }
  //
  // public removeStatusEffect(status_effect: StatusEffect) {
  //   const index = this.effect_list.findIndex(effect => effect === status_effect);
  //   this.effect_list.splice(index, 1);
  // }
}

export interface UnitInitializer extends EntityEventElementInitializer<UnitEntity> {
  health?: number;
  alignment: UnitAlignmentType;

  encounter: Encounter;
  skill_list?: (SkillEntity | SkillInitializer)[];
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

type UnitEventHandler = {
  [UnitEventType.KILL]: (event: UnitKillEvent) => void
  [UnitEventType.KILLED]: (event: UnitKillEvent) => void
  [UnitEventType.REVIVED]: (event: UnitKillEvent) => void
  [UnitEventType.REVIVING]: (event: UnitKillEvent) => void
  [UnitEventType.DAMAGE_RECEIVED]: (event: UnitDamageEvent) => void
  [UnitEventType.DAMAGE_APPLIED]: (event: UnitDamageEvent) => void
  [UnitEventType.HEALING_RECEIVED]: (event: UnitHealEvent) => void
  [UnitEventType.HEALING_APPLIED]: (event: UnitHealEvent) => void
  [UnitEventType.COMBO_POINT_APPLIED]: (event: UnitComboPointEvent) => void
  [UnitEventType.COMBO_POINT_RECEIVED]: (event: UnitComboPointEvent) => void
}
