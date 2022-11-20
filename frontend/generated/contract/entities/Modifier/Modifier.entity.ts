import {ModifierType} from "../../enums/Discriminator/ModifierType";
import {ModifierCategoryType} from "../../enums/Modifier/ModifierCategoryType";
import {CoreEntity} from "../Core.entity";

export interface ModifierEntity extends CoreEntity {
  type: ModifierType;
  value: number;
  value_per_level: number;
  category: ModifierCategoryType;
}
