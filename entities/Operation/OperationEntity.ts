import TargetType from "../../enums/TargetType";
import {ActionEntity} from "../Action";
import {EffectEntity} from "../Effect";
import {ModifierEntity} from "../Modifier";

export default class OperationEntity {

  public description?: string;
  public target: TargetType;
  public modifier_list: ModifierEntity[];
  public action_list: ActionEntity[];
  public effect_list: EffectEntity[];

  constructor(initializer: OperationEntityInitializer) {
    this.description = initializer.description;
    this.target = initializer.target;
    this.modifier_list = initializer.modifier_list ?? [];
    this.action_list = initializer.action_list ?? [];
    this.effect_list = initializer.effect_list ?? [];
  }
}

export interface OperationEntityInitializer {
  description?: string;
  target: TargetType;
  modifier_list?: ModifierEntity[];
  action_list?: ActionEntity[];
  effect_list?: EffectEntity[];
}
