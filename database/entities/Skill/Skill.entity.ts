import {Collection, Entity, Enum, ManyToMany, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {SkillType} from "../../enums";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {ModifierEntity} from "../Modifier";
import {OperationEntity} from "../Operation";

@ObjectType({implements: CoreEntity})
@Entity()
export class SkillEntity extends CoreEntity<SkillEntity> {
  
  @Field()
  @Property()
  public name: string;
  
  @Field()
  @Property()
  public description?: string;
  
  @Field(() => SkillType)
  @Enum(() => SkillType)
  public type: SkillType;
  
  @Field(() => [OperationEntity])
  @ManyToMany(() => OperationEntity)
  public operation_list: Collection<OperationEntity>;
  
  @Field(() => [ModifierEntity])
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  constructor(initializer: SkillEntityInitializer) {
    super(initializer);
  
    this.name = initializer.name;
    this.description = initializer.description ?? "";
    this.type = initializer.type;
    this.operation_list = this.toCollectionFromList(initializer.operation_list);
    this.modifier_list = this.toCollectionFromList(initializer.modifier_list);
  }
}

export interface SkillEntityInitializer extends CoreEntityInitializer {
  name: string;
  description?: string;
  type: SkillType;
  operation_list?: OperationEntity[] | Collection<OperationEntity>;
  modifier_list?: ModifierEntity[] | Collection<ModifierEntity>;
}
