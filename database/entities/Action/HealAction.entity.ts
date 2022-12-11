import {Entity, Property} from "@mikro-orm/core";
import {Field, ObjectType, Resolver} from "type-graphql";
import {ActionType} from "../../enums";
import {CoreEntity} from "../Core.entity";
import {ActionEntity, ActionEntityInitializer} from "./Action.entity";

@ObjectType({implements: [CoreEntity, ActionEntity]})
@Entity({discriminatorValue: ActionType.HEAL})
@Resolver(() => HealActionEntity)
export class HealActionEntity extends ActionEntity<HealActionEntity> {
  
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

export const HealActionPaginationOrder = HealActionEntity.registerAsEnum(
  "HealActionPaginationOrder",
  ["id", "created_at", "updated_at", "direct"]
);

export interface HealActionEntityInitializer extends ActionEntityInitializer {
  direct?: boolean;
  reviving?: boolean;
}
