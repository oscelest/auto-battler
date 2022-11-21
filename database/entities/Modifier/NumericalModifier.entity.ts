import {Entity, Enum} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {ModifierNumericalType, ModifierType} from "../../enums";
import {ModifierEntity, ModifierEntityInitializer} from "./Modifier.entity";

@ObjectType()
@Entity({
  discriminatorValue: ModifierType.NUMERICAL
})
export class NumericalModifierEntity extends ModifierEntity {
  
  @Field(() => ModifierNumericalType)
  @Enum(() => ModifierNumericalType)
  public numerical_type: ModifierNumericalType;
  
  constructor(initializer: NumericalModifierEntityInitializer) {
    super(ModifierType.NUMERICAL, initializer);
    this.numerical_type = initializer.numerical_type;
  }
}

export interface NumericalModifierEntityInitializer extends ModifierEntityInitializer {
  numerical_type: ModifierNumericalType;
}
