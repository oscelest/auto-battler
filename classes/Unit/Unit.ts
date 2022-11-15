import {EffectEntity, ModifierEntity, SkillEntity, UnitEntity} from "../../entities";
import {SkillEventType, UnitEventType} from "../../enums";
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
import DamageLogEntry from "../Log/LogEntry/DamageLogEntry";
import EffectLogEntry from "../Log/LogEntry/EffectLogEntry";
import HealLogEntry from "../Log/LogEntry/HealLogEntry";
import {ComboSkill, Skill} from "../Skill";
import {SkillComboPointEvent, SkillInitializer} from "../Skill/Skill";
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
    this.on(UnitEventType.DIED, this.onUnitKilled);
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
    this.trigger(UnitEventType.DIED, {target_unit: this, source});
  }
  
  public applyDamageTo(target_unit: Unit, action: UnitDamageAction, source: Source = this.reference): void {
    if (!target_unit.alive) return;
    
    const received_value = target_unit.receiveDamageFrom(source, action);
    if (received_value > 0) {
      this.trigger(UnitEventType.DAMAGE_APPLIED, {...action, target_unit, source, received_value});
    }
  }
  
  public receiveDamageFrom(source: Source, action: UnitDamageAction): number {
    if (!this.alive) return 0;
    
    const armor = Modifier.getCategoryValue([ModifierCategoryType.UNIT_ATTRIBUTE_ARMOR], this.modifier_list, this);
    
    const received_value = Math.min(action.applied_value * (100 / (100 + armor)), this.health);
    this.health -= received_value;
    
    if (received_value > 0) {
      this.trigger(UnitEventType.DAMAGE_RECEIVED, {...action, target_unit: this, source, received_value});
    }
    if (!this.alive) {
      this.die(source);
    }
    
    return received_value;
  }
  
  public applyHealingTo(target_unit: Unit, action: UnitHealAction, source: Source = this.reference): void {
    const currently_alive = target_unit.alive;
    if (!currently_alive && !action.reviving) return;
    
    const received_value = target_unit.receiveHealingFrom(source, action);
    if (!currently_alive && target_unit.alive) {
      this.trigger(UnitEventType.REVIVE_APPLIED, {source, target_unit});
    }
    if (received_value > 0) {
      this.trigger(UnitEventType.HEALING_APPLIED, {...action, target_unit, source, received_value});
    }
  }
  
  public receiveHealingFrom(source: Source, action: UnitHealAction): number {
    if (!this.alive && !action.reviving) return 0;
    
    const modifier_list = this.modifier_list;
    const max_heath = Modifier.getCategoryValue(ModifierCategoryType.UNIT_ATTRIBUTE_HEALTH, modifier_list, this);
    const heal_modifier = Modifier.getCategoryValue(ModifierCategoryType.HEAL, modifier_list, this);
  
    const received_value = Math.min(action.applied_value + heal_modifier, max_heath - this.health);
    const revived = !this.alive && received_value > 0;
    this.health += received_value;
    
    if (revived) {
      this.trigger(UnitEventType.REVIVE_RECEIVED, {source, target_unit: this});
    }
    if (received_value > 0) {
      this.trigger(UnitEventType.HEALING_RECEIVED, {...action, source, target_unit: this, received_value});
    }
    
    return received_value;
  }
  
  public applyComboPointTo(target_unit: Unit, action: UnitComboPointAction, source: Source = this.reference) {
    if (!target_unit.alive) return;
    
    target_unit.receiveComboPointFrom(source, action);
  }
  
  public receiveComboPointFrom(source: Source, action: UnitComboPointAction) {
    if (!this.alive) return;
    
    for (let skill of this.skill_list) {
      if (skill instanceof ComboSkill) {
        skill.receiveComboPointFrom(source, action);
      }
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
  
    for (let skill of this.skill_list) {
      if (skill instanceof ComboSkill) skill.on(SkillEventType.COMBO_POINT_RECEIVED, this.onSkillComboPointReceived);
    }
  }
  
  private detachEvents() {
    this.off(UnitEventType.DAMAGE_RECEIVED, this.onDamageReceived);
    this.off(UnitEventType.HEALING_RECEIVED, this.onHealingReceived);
    this.off(UnitEventType.EFFECT_RECEIVED, this.onEffectReceived);
  
    for (let skill of this.skill_list) {
      if (skill instanceof ComboSkill) {
        skill.off(SkillEventType.COMBO_POINT_RECEIVED, this.onSkillComboPointReceived);
      }
    }
  }
  
  private onUnitKilled = () => {
    this.detachEvents();
  };
  
  private onUnitRevived = () => {
    this.attachEvents();
  };
  
  private onDamageReceived = (event: UnitDamageEvent) => {
    this.encounter.log.writeEntry(event.source, new DamageLogEntry(event));
  };
  
  private onHealingReceived = (event: UnitHealEvent) => {
    this.encounter.log.writeEntry(event.source, new HealLogEntry(event));
  };
  
  private onEffectReceived = (event: UnitEffectEvent) => {
    this.encounter.log.writeEntry(event.source, new EffectLogEntry(event));
  };
  
  private onSkillComboPointReceived = (event: SkillComboPointEvent) => {
    this.trigger(UnitEventType.SKILL_COMBO_POINT_RECEIVED, {...event, unit: this});
  };
}

export interface UnitInitializer extends EntityEventElementInitializer<UnitEntity> {
  health?: number;
  alignment: UnitAlignmentType;
  
  encounter: Encounter;
  skill_list?: SkillInitializer[];
  effect_list?: EffectInitializer[];
}

export interface UnitDamageAction {
  applied_value: number;
  damage_source: DamageSourceType;
  damage_element: DamageElementType;
  direct: boolean;
  periodic: boolean;
}

export interface UnitHealAction {
  applied_value: number;
  direct: boolean;
  periodic: boolean;
  reviving: boolean;
}

export interface UnitComboPointAction {
  applied_value: number;
  retained: boolean;
  periodic: boolean;
}

export interface UnitEvent {
  source: Source;
  target_unit: Unit;
}

export interface UnitKillEvent extends UnitEvent {}

interface UnitValueEvent extends UnitEvent {
  received_value: number;
}

export interface UnitDamageEvent extends UnitDamageAction, UnitValueEvent {}

export interface UnitHealEvent extends UnitHealAction, UnitValueEvent {}

export interface UnitComboPointEvent extends SkillComboPointEvent {
  unit: Unit;
}

export interface UnitEffectEvent extends UnitEvent {
  effect: Effect;
}

type UnitEventHandler = {
  [UnitEventType.KILL]: (event: UnitKillEvent) => void
  [UnitEventType.DIED]: (event: UnitKillEvent) => void
  [UnitEventType.REVIVE_RECEIVED]: (event: UnitKillEvent) => void
  [UnitEventType.REVIVE_APPLIED]: (event: UnitKillEvent) => void
  [UnitEventType.DAMAGE_RECEIVED]: (event: UnitDamageEvent) => void
  [UnitEventType.DAMAGE_APPLIED]: (event: UnitDamageEvent) => void
  [UnitEventType.HEALING_RECEIVED]: (event: UnitHealEvent) => void
  [UnitEventType.HEALING_APPLIED]: (event: UnitHealEvent) => void
  [UnitEventType.EFFECT_APPLIED]: (event: UnitEffectEvent) => void
  [UnitEventType.EFFECT_RECEIVED]: (event: UnitEffectEvent) => void
  [UnitEventType.SKILL_COMBO_POINT_RECEIVED]: (event: UnitComboPointEvent) => void
}
