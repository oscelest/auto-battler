import {Collection, Entity, ManyToMany, ManyToOne, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {SkillEntity} from "../Skill";
import {UnitClassEntity} from "./UnitClass.entity";

@ObjectType({implements: CoreEntity})
@Entity()
export class UnitEntity extends CoreEntity<UnitEntity> {
  
  @Field()
  @Property()
  public name: string;
  
  @Field(() => UnitClassEntity)
  @ManyToOne(() => UnitClassEntity)
  public class: UnitClassEntity;
  
  @Field()
  @Property()
  public experience: number;
  
  @Field(() => [SkillEntity])
  @ManyToMany(() => SkillEntity)
  public skill_list: Collection<SkillEntity>;
  
  constructor(initializer: UnitEntityInitializer) {
    super(initializer);
    this.name = initializer.name;
    this.class = initializer.class;
    this.experience = initializer.experience ?? 0;
    this.skill_list = initializer.skill_list ?? new Collection<SkillEntity>(this);
  }
}

export interface UnitEntityInitializer extends CoreEntityInitializer {
  name: string;
  class: UnitClassEntity;
  experience?: number;
  skill_list?: Collection<SkillEntity>;
}
