import {Entity, Enum} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {EffectExpirationType, TriggerType} from "../../enums";
import {CoreEntity} from "../Core.entity";
import {TriggerEntity, TriggerEntityInitializer} from "./Trigger.entity";

@ObjectType({implements: [CoreEntity, TriggerEntity]})
@Entity({discriminatorValue: TriggerType.EXPIRATION})
export class ExpirationTriggerEntity extends TriggerEntity {
  
  @Field(() => EffectExpirationType)
  @Enum(() => EffectExpirationType)
  public expiration_type: EffectExpirationType;
  
  constructor(initializer: ExpirationTriggerEntityInitializer) {
    super(TriggerType.PERIODIC, initializer);
    this.expiration_type = initializer.expiration_type;
  }
}

export interface ExpirationTriggerEntityInitializer extends TriggerEntityInitializer {
  expiration_type: EffectExpirationType;
}
