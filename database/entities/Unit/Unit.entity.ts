import {Collection, Entity, ManyToMany, ManyToOne, Property} from "@mikro-orm/core";
import {Field, ObjectType} from "type-graphql";
import {CoreEntity, CoreEntityInitializer} from "../Core.entity";
import {SkillEntity} from "../Skill";
import {UnitTypeEntity} from "./UnitTypeEntity";

@ObjectType({implements: CoreEntity})
@Entity()
export class UnitEntity extends CoreEntity<UnitEntity> {
  
  @Field()
  @Property()
  public name: string;
  
  @Field()
  @Property()
  public experience: number;
  
  @Field(() => UnitTypeEntity)
  @ManyToOne(() => UnitTypeEntity)
  public type: UnitTypeEntity;
  
  @Field(() => [SkillEntity])
  @ManyToMany(() => SkillEntity)
  public skill_list: Collection<SkillEntity>;
  
  constructor(initializer: UnitEntityInitializer) {
    super(initializer);
    this.name = initializer.name;
    this.type = initializer.type;
    this.experience = initializer.experience ?? 0;
    this.skill_list = this.toCollectionFromList(initializer.skill_list);
  }
}

export const UnitPaginationOrder = UnitEntity.registerAsEnum(
  "UnitPaginationOrder",
  ["id", "created_at", "updated_at", "name", "experience", "type.id"]
);

export interface UnitEntityInitializer extends CoreEntityInitializer {
  name: string;
  experience?: number;
  type: UnitTypeEntity;
  skill_list?: SkillEntity[] | Collection<SkillEntity>;
}
