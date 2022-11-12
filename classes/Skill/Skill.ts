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

  public unit: Unit;

  protected constructor(initializer: SkillInitializer<Entity>) {
    super(initializer);
    this.unit = initializer.unit;
    this.on(SkillEventType.USE, this.onSkillUse);
  }

  public get source(): Source<SourceType.SKILL> {
    return new Source({type: SourceType.SKILL, value: this});
  }

  public get modifier_list(): ModifierEntity[] {
    return [...this.entity.modifier_list];
  }

  public static instantiate(initializer: SkillInitializer) {
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

  private onSkillUse = ({skill, source}: SkillUseEvent) => {
    for (let operation of skill.entity.operation_list) {
      Operation.execute(operation, skill.unit, source);
    }
  };

}

export interface SkillInitializer<Entity extends SkillEntity = SkillEntity> extends EntityEventElementInitializer<Entity> {
  unit: Unit;
}

export interface SkillUseEvent {
  skill: Skill;
  source: Source;
}

type SkillEventHandler = {
  [SkillEventType.USE]: (event: SkillUseEvent) => void
}

