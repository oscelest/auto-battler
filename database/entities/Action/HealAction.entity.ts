import {Entity, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {ActionType} from "../../enums";
import {CoreEntity} from "../Core.entity";
import {ActionEntity, ActionEntityInitializer} from "./Action.entity";

@ObjectType({implements: [CoreEntity, ActionEntity]})
@Entity({discriminatorValue: ActionType.HEAL})
export class HealActionEntity extends ActionEntity {
  
  @Field()
  @Property()
  public direct: boolean;
  
  @Field()
  @Property()
  public reviving: boolean;
  
  constructor(initializer: HealActionEntityInitializer) {
    super(ActionType.HEAL, initializer);
    this.direct = initializer.direct ?? true;
    this.reviving = initializer.reviving ?? false;
  }
}

export interface HealActionEntityInitializer extends ActionEntityInitializer {
  direct?: boolean;
  reviving?: boolean;
}
