import {Entity, ManyToOne} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {ActionType} from "../../enums";
import {EffectEntity} from "../Effect";
import {ActionEntity, ActionEntityInitializer} from "./Action.entity";

@ObjectType()
@Entity({
  discriminatorValue: ActionType.EFFECT
})
export class EffectActionEntity extends ActionEntity {
  
  @Field(() => EffectEntity)
  @ManyToOne(() => EffectEntity)
  public effect: EffectEntity;
  
  constructor(initializer: EffectActionEntityInitializer) {
    super(ActionType.EFFECT, initializer);
    
    this.effect = initializer.effect;
  }
}

export interface EffectActionEntityInitializer extends ActionEntityInitializer {
  effect: EffectEntity;
}
