import ActionType from "../../enums/ActionType";
import DamageElementType from "../../enums/Damage/DamageElementType";
import DamageSourceType from "../../enums/Damage/DamageSourceType";
import {ActionEntity, ActionEntityInitializer} from "./index";

export default class DamageActionEntity extends ActionEntity {

  public direct: boolean;
  public source_type: DamageSourceType;
  public element_type: DamageElementType;

  constructor(initializer: DamageActionEntityInitializer) {
    super(ActionType.DAMAGE, initializer);

    this.direct = initializer.direct;
    this.source_type = initializer.source_type;
    this.element_type = initializer.element_type;
  }
}

export interface DamageActionEntityInitializer extends ActionEntityInitializer {
  direct: boolean;
  source_type: DamageSourceType;
  element_type: DamageElementType;
}
