import {v4} from "uuid";
import {BaseEntity, Entity, PrimaryKey, Property} from "@mikro-orm/core";

@Entity({abstract: true})
export abstract class CoreEntity<T extends {id: string}> extends BaseEntity<T, "id"> {
  
  @PrimaryKey({type: "uuid"})
  public id: string;
  
  @Property()
  public createdAt: Date;
  
  @Property({onUpdate: () => new Date()})
  public updatedAt: Date;
  
  protected constructor(initializer: CoreEntityInitializer) {
    super();
    this.id = initializer.id ?? v4();
    this.createdAt = initializer.createdAt ?? new Date();
    this.updatedAt = initializer.updatedAt ?? new Date();
  }
}

export interface CoreEntityInitializer {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
