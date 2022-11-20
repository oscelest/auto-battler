import {ModifierEntity, SkillEntity} from "../../entities";
import {SkillEventType} from "../../enums";
import SkillType from "../../enums/Discriminator/SkillType";
import SourceType from "../../enums/Discriminator/SourceType";
import ModifierCategoryType from "../../enums/Modifier/ModifierCategoryType";
import Modifier from "../../modules/Modifier";
import Operation from "../../modules/Operation";
import {EntityEventElement} from "../Base";
import {EntityEventElementInitializer} from "../Base/EntityEventElement";
import Source from "../Source/Source";
import {Unit} from "../Unit";
import {ChargeSkillInitializer} from "./ChargeSkill";
import {ComboSkillInitializer} from "./ComboSkill";
import {ChargeSkill, ComboSkill} from "./index";

export default abstract class Skill extends EntityEventElement<SkillEntity, SkillEventHandler> {
  
  public readonly unit: Unit;
  public readonly source: Source<SourceType.SKILL>;
  
  protected constructor(initializer: SkillInitializer) {
    super(initializer);
    this.unit = initializer.unit;
    this.source = new Source({type: SourceType.SKILL, value: this});
    
    this.on(SkillEventType.USE, Skill.onSkillUse);
  }
  
  public get modifier_list(): ModifierEntity[] {
    return [...this.entity.modifier_list];
  }
  
  private static onSkillUse = ({skill}: SkillUseEvent) => {
    skill.unit.encounter.log.writeBegin(skill.source);
    for (let operation of skill.entity.operation_list) {
      Operation.execute(operation, skill.unit, skill.source);
    }
    skill.unit.encounter.log.writeEnd(skill.source, `${skill.unit} used ${skill}`);
  };
  
  public static instantiate<T extends SkillEntity | SkillInitializer>(initializer: SkillInitializer) {
    switch (initializer.entity.type) {
      case SkillType.COMBO:
        return new ComboSkill(initializer as ComboSkillInitializer);
      case SkillType.CHARGE:
        return new ChargeSkill(initializer as ChargeSkillInitializer);
    }
  }
  
  public toString(): string {
    return this.entity.name;
  }
  
  public getCategoryValue(category: ModifierCategoryType, unit: Unit = this.unit) {
    return Modifier.getCategoryValue(category, [...this.modifier_list, ...unit.modifier_list], unit);
  }
  
}

export interface SkillInitializer extends EntityEventElementInitializer<SkillEntity> {
  unit: Unit;
}

export interface SkillUseEvent {
  skill: Skill;
}

export interface SkillComboPointEvent {
  skill: Skill;
  received_value: number;
  retained: boolean;
  periodic: boolean;
}

type SkillEventHandler = {
  [SkillEventType.USE]: (event: SkillUseEvent) => void
  [SkillEventType.COMBO_POINT_RECEIVED]: (event: SkillComboPointEvent) => void
}

