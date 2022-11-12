import ActionType from "../../enums/ActionType";
import {ModifierEntity} from "../Modifier";

export default abstract class ActionEntity {

  public type: ActionType;

  public modifier_list: ModifierEntity[];

  protected constructor(type: ActionType, initializer: ActionEntityInitializer) {
    this.type = type;

    this.modifier_list = initializer.modifier_list ?? [];
  }
}

export interface ActionEntityInitializer {
  modifier_list?: ModifierEntity[];
}
