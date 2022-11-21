import {Collection, Entity, ManyToMany, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {ModifierEntity} from "../Modifier";

@Entity()
@ObjectType()
export class UnitClassEntity extends CoreEntity<UnitClassEntity> {
  
  @Field()
  @Property()
  public name: string;
  
  @Field(() => [ModifierEntity])
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  /* ----- Relations ----- */
  
  // @OneToMany(() => UnitEntity, relation => relation.class)
  // public unit_list?: Collection<UnitEntity>;
  
  constructor(initializer: UnitClassEntityInitializer) {
    super(initializer);
    
    this.name = initializer.name;
    this.modifier_list = initializer.modifier_list ?? new Collection<ModifierEntity>(this);
    
    // this.unit_list = initializer.unit_list ?? new Collection<UnitEntity>(this);
  }
}

export interface UnitClassEntityInitializer extends CoreEntityInitializer {
  name: string;
  modifier_list?: Collection<ModifierEntity>;
  
  // unit_list?: Collection<UnitEntity>;
}
