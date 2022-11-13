import {ModifierEntity, SkillEntity} from "../../entities";
import {SkillEventType} from "../../enums";
import SkillType from "../../enums/SkillType";
import SourceType from "../../enums/SourceType";
import Operation from "../../modules/Operation";
import {EntityEventElement} from "../Base";
import {EntityEventElementInitializer} from "../Base/EntityEventElement";
import Source from "../Source";
import {Unit} from "../Unit";
import {ChargeSkillInitializer} from "./ChargeSkill";
import {ComboSkillInitializer} from "./ComboSkill";
import {ChargeSkill, ComboSkill} from "./index";

export default abstract class Skill<Entity extends SkillEntity = SkillEntity> extends EntityEventElement<Entity, SkillEventHandler> {
  
  public readonly unit: Unit;
  public readonly source: Source<SourceType.SKILL>;
  
  protected constructor(initializer: SkillInitializer<Entity>) {
    super(initializer);
    this.unit = initializer.unit;
    this.source = new Source({type: SourceType.SKILL, value: this});
    
    this.on(SkillEventType.USE, Skill.onSkillUse);
  }
  
  public get modifier_list(): ModifierEntity[] {
    return [...this.entity.modifier_list];
  }
  
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
  
  private static onSkillUse = ({skill}: SkillUseEvent) => {
    skill.unit.encounter.log.writeBegin(skill.source);
    for (let operation of skill.entity.operation_list) {
      Operation.execute(operation, skill.unit, skill.source);
    }
    skill.unit.encounter.log.writeFinish(skill.source);
  };
  
}

export interface SkillInitializer<Entity extends SkillEntity = SkillEntity> extends EntityEventElementInitializer<Entity> {
  unit: Unit;
}

export interface SkillUseEvent {
  skill: Skill;
}

type SkillEventHandler = {
  [SkillEventType.USE]: (event: SkillUseEvent) => void
}

