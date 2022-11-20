import {SkillType} from "../../enums/Discriminator/SkillType";
import {CoreEntity} from "../Core.entity";
import {ModifierEntity} from "../Modifier/Modifier.entity";
import {OperationEntity} from "../Operation/Operation.entity";

export interface SkillEntity extends CoreEntity {
  name: string;
  description: string;
  type: SkillType;
  operation_list: OperationEntity[];
  modifier_list: ModifierEntity[];
}

export function isSkillEntity(object: any): object is SkillEntity {
  return "entity" in object;
}
