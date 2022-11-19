import {Collection, Entity, ManyToMany, ManyToOne, Property} from "@mikro-orm/core";
import {CoreEntity, CoreEntityInitializer} from "../CoreEntity";
import {SkillEntity} from "../Skill";
import {UnitClassEntity} from "./index";

@Entity()
export default class UnitEntity extends CoreEntity<UnitEntity> {
  
  @Property()
  public name: string;
  
  @ManyToOne(() => UnitClassEntity)
  public class: UnitClassEntity;
  
  @Property()
  public experience: number;
  
  @ManyToMany(() => SkillEntity)
  public skill_list: Collection<SkillEntity>;
  
  /* ----- Relations ----- */
  
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
