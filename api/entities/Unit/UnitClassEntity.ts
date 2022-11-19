import {Collection, Entity, ManyToMany, OneToMany, Property} from "@mikro-orm/core";
import {CoreEntity, CoreEntityInitializer} from "../CoreEntity";
import {ModifierEntity} from "../Modifier";
import {UnitEntity} from "./index";

@Entity()
export default class UnitClassEntity extends CoreEntity<UnitClassEntity> {
  
  @Property()
  public name: string;
  
  @ManyToMany(() => ModifierEntity)
  public modifier_list: Collection<ModifierEntity>;
  
  /* ----- Relations ----- */
  
  @OneToMany(() => UnitEntity, relation => relation.class)
  public unit_list?: Collection<UnitEntity>;
  
  constructor(initializer: UnitClassEntityInitializer) {
    super(initializer);
    
    this.name = initializer.name;
    this.modifier_list = initializer.modifier_list ?? new Collection<ModifierEntity>(this);
    
    this.unit_list = initializer.unit_list ?? new Collection<UnitEntity>(this);
  }
}

export interface UnitClassEntityInitializer extends CoreEntityInitializer {
  name: string;
  modifier_list?: Collection<ModifierEntity>;
  
  unit_list?: Collection<UnitEntity>;
}
