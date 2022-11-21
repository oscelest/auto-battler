import {Entity, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {ActionType} from "../../enums";

import {ActionEntity, ActionEntityInitializer} from "./Action.entity";

@ObjectType()
@Entity({
  discriminatorValue: ActionType.COMBO_POINT
})
export class ComboPointActionEntity extends ActionEntity {
  
  @Field()
  @Property()
  public base_value: number;
  
  @Field()
  @Property()
  public retained: boolean;
  
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
}
