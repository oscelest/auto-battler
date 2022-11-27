import {BaseEntity, Collection, Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, InterfaceType} from "type-graphql";
import {v4} from "uuid";

@InterfaceType({isAbstract: true})
@Entity({abstract: true})
export abstract class CoreEntity<T extends {id: string} = any> extends BaseEntity<T, "id"> {
  
  @Field()
  @PrimaryKey({type: "uuid"})
  public id: string;
  
  @Field()
  @Property()
  public created_at: Date;
  
  @Field()
  @Property({onUpdate: () => new Date()})
  public updated_at: Date;
  
  protected constructor(initializer: CoreEntityInitializer) {
    super();
    this.id = initializer.id ?? v4();
    this.created_at = initializer.created_at ?? new Date();
    this.updated_at = initializer.updated_at ?? new Date();
  }
  
  protected toCollectionFromList<M extends object>(list: M[] | Collection<M> = []) {
    return list instanceof Collection ? list : new Collection<M>(this, list);
  }
}

export interface CoreEntityInitializer {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
}
