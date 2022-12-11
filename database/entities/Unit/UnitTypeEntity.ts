import {Collection, Entity, ManyToMany, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {ModifierEntity} from "../Modifier";

@ObjectType({implements: CoreEntity})
@Entity()
export class UnitTypeEntity extends CoreEntity<UnitTypeEntity> {
  
  @Field()
  @Property()
  public name: string;
  
  @Field(() => [ModifierEntity])
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  constructor(initializer: UnitClassEntityInitializer) {
    super(initializer);
    
    this.name = initializer.name;
    this.modifier_list = this.toCollectionFromList(initializer.modifier_list);
  }
  
}

export interface UnitClassEntityInitializer extends CoreEntityInitializer {
  name: string;
  modifier_list?: ModifierEntity[] | Collection<ModifierEntity>;
}

export const UnitTypePaginationOrder = UnitTypeEntity.registerAsEnum("UnitTypePaginationOrder", ["id", "created_at", "updated_at", "name"]);
