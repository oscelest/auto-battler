import SkillType from "../../enums/Discriminator/SkillType";
import {ModifierEntity} from "../Modifier";
import {OperationEntity} from "../Operation";

export default class SkillEntity {
  
  public name: string;
  public type: SkillType;
  public operation_list: OperationEntity[];
  public modifier_list: ModifierEntity[];
  
  constructor(initializer: SkillEntityInitializer) {
    this.name = initializer.name;
    this.type = initializer.type;
    this.operation_list = initializer.operation_list ?? [];
    this.modifier_list = initializer.modifier_list ?? [];
  }
}

export interface SkillEntityInitializer {
  name: string;
  type: SkillType;
  operation_list?: OperationEntity[];
  modifier_list?: ModifierEntity[];
}
