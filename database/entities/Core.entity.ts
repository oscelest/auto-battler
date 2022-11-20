import {BaseEntity, Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {v4} from "uuid";

@Entity({abstract: true})
export abstract class CoreEntity<T extends {id: string}> extends BaseEntity<T, "id"> {
  
  @PrimaryKey({type: "uuid"})
  public id: string;
  
  @Property()
  public created_at: Date;
  
  @Property({onUpdate: () => new Date()})
  public updated_at: Date;
  
  protected constructor(initializer: CoreEntityInitializer) {
    super();
    this.id = initializer.id ?? v4();
    this.created_at = initializer.created_at ?? new Date();
    this.updated_at = initializer.updated_at ?? new Date();
  }
}

export interface CoreEntityInitializer {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
}
