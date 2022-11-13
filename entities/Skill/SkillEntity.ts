import SkillType from "../../enums/Encounter/SkillType";
import {ModifierEntity} from "../Modifier";
import {OperationEntity} from "../Operation";

export default abstract class SkillEntity {

  public type: SkillType;

  public name: string;
  public operation_list: OperationEntity[];
  public modifier_list: ModifierEntity[];

  protected constructor(type: SkillType, initializer: SkillEntityInitializer) {
    this.type = type;

    this.name = initializer.name;
    this.operation_list = initializer.operation_list ?? [];
    this.modifier_list = initializer.modifier_list ?? [];
  }
}

export interface SkillEntityInitializer {
  name: string;
  operation_list?: OperationEntity[];
  modifier_list?: ModifierEntity[];
}
