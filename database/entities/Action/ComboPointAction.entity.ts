import {Entity, Property} from "@mikro-orm/core";
import {Field, ObjectType, Resolver} from "type-graphql";
import {ActionType} from "../../enums";
import {CoreEntity} from "../Core.entity";
import {ActionEntity, ActionEntityInitializer} from "./Action.entity";

@ObjectType({implements: [CoreEntity, ActionEntity]})
@Entity({discriminatorValue: ActionType.COMBO_POINT})
@Resolver(() => ComboPointActionEntity)
export class ComboPointActionEntity extends ActionEntity<ComboPointActionEntity> {
  
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
  }
  
  public static generate(initializer: Partial<ComboPointActionEntityInitializer>) {
    return new this({
      ...ActionEntity.generate(initializer),
      retained: initializer.retained ?? false,
      base_value: initializer.base_value ?? 0
    });
  }
  
}

export const ComboPointActionPaginationOrder = ComboPointActionEntity.registerAsEnum(
  "ComboPointActionPaginationOrder",
  ["id", "created_at", "updated_at", "base_value"]
);


export interface ComboPointActionEntityInitializer extends ActionEntityInitializer {
  base_value: number;
  retained?: boolean;
}
