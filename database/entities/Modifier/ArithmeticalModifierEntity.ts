import {Entity, Enum} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {ArithmeticalType, ModifierType} from "../../enums";
import {CoreEntity} from "../Core.entity";
import {ModifierEntity, ModifierEntityInitializer} from "./Modifier.entity";

@ObjectType({implements: [CoreEntity, ModifierEntity]})
@Entity({discriminatorValue: ModifierType.ARITHMETICAL})
export class ArithmeticalModifierEntity extends ModifierEntity {
  
  @Field(() => ArithmeticalType)
  @Enum(() => ArithmeticalType)
  public arithmetical: ArithmeticalType;
  
  constructor(initializer: ArithmeticalModifierEntityInitializer) {
    super(ModifierType.ARITHMETICAL, initializer);
    this.arithmetical = initializer.arithmetical;
  }
}

export interface ArithmeticalModifierEntityInitializer extends ModifierEntityInitializer {
  arithmetical: ArithmeticalType;
}
