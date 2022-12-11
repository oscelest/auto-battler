import {Collection, Entity, Enum, ManyToMany} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {TargetType} from "../../enums";
import {ActionEntity} from "../Action";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {ModifierEntity} from "../Modifier";

@ObjectType({implements: CoreEntity})
@Entity()
export class OperationEntity extends CoreEntity<OperationEntity> {
  
  @Field(() => TargetType)
  @Enum(() => TargetType)
  public target: TargetType;
  
  @Field(() => [ModifierEntity])
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  @Field(() => [ActionEntity])
  @ManyToMany(() => ActionEntity)
  public action_list: Collection<ActionEntity>;
  
  constructor(initializer: OperationEntityInitializer) {
    super(initializer);
    
    this.target = initializer.target;
    this.modifier_list = this.toCollectionFromList(initializer.modifier_list);
    this.action_list = this.toCollectionFromList(initializer.action_list);
  }
  
}

export const OperationPaginationOrder = OperationEntity.registerAsEnum(
  "OperationPaginationOrder",
  ["id", "created_at", "updated_at", "target"]
);

export interface OperationEntityInitializer extends CoreEntityInitializer {
  target: TargetType;
  action_list?: ActionEntity[] | Collection<ActionEntity>;
  modifier_list?: ModifierEntity[] | Collection<ModifierEntity>;
}
