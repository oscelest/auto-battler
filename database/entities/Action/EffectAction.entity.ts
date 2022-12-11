import {Entity, ManyToOne} from "@mikro-orm/core";
import {Field, ObjectType, Resolver} from "type-graphql";
import {ActionType} from "../../enums";
import {CoreEntity} from "../Core.entity";
import {EffectEntity} from "../Effect";
import {ActionEntity, ActionEntityInitializer} from "./Action.entity";

@ObjectType({implements: [CoreEntity, ActionEntity]})
@Entity({discriminatorValue: ActionType.EFFECT})
@Resolver(() => EffectActionEntity)
export class EffectActionEntity extends ActionEntity<EffectActionEntity> {
  
  @Field(() => EffectEntity)
  @ManyToOne(() => EffectEntity)
  public effect: EffectEntity;
  
  constructor(initializer: EffectActionEntityInitializer) {
    super(ActionType.EFFECT, initializer);
    
    this.effect = initializer.effect;
  }
  
  
}

export const EffectActionPaginationOrder = EffectActionEntity.registerAsEnum(
  "EffectActionPaginationOrder",
  ["id", "created_at", "updated_at", "effect.id"]
);

export interface EffectActionEntityInitializer extends ActionEntityInitializer {
  effect: EffectEntity;
}
