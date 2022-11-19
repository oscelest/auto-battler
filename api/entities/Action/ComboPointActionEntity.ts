import {Entity, Property} from "@mikro-orm/core";
import ActionType from "../../../enums/Encounter/ActionType";
import {ActionEntity, ActionEntityInitializer} from "./index";

@Entity()
export default class ComboPointActionEntity extends ActionEntity {
  
  @Property()
  public base_value: number;
  
  @Property()
  public retained: boolean;
  
  @Property()
  public periodic: boolean;
  
  constructor(initializer: ComboPointActionEntityInitializer) {
    super(ActionType.COMBO_POINT, initializer);
    
    this.base_value = initializer.base_value;
    this.retained = initializer.retained ?? false;
    this.periodic = initializer.periodic ?? false;
  }
}

export interface ComboPointActionEntityInitializer extends ActionEntityInitializer {
  base_value: number;
  retained?: boolean;
  periodic?: boolean;
}
