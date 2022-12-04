import {BaseEntity, Collection, Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {Field, InterfaceType, registerEnumType} from "type-graphql";
import {v4} from "uuid";
import {QueryOrder} from "../enums";
import {Constructor, EntityOrderKey} from "../Globals";

// noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
@InterfaceType({isAbstract: true})
@Entity({abstract: true})
export abstract class CoreEntity<E extends CoreEntity = any> extends BaseEntity<E, "id"> {
  
  @Field()
  @PrimaryKey({type: "uuid"})
  public id: string;
  
  @Field()
  @Property()
  public created_at: Date;
  
  @Field()
  @Property({onUpdate: () => new Date()})
  public updated_at: Date;
  
  constructor(initializer: CoreEntityInitializer) {
    super();
    this.id = initializer.id ?? v4();
    this.created_at = initializer.created_at ?? new Date();
    this.updated_at = initializer.updated_at ?? new Date();
  }
  
  public toCollectionFromList<E extends CoreEntity>(list?: E[] | Collection<E>): Collection<E> {
    return list instanceof Collection ? list : new Collection<E>(this, list);
  }
  
  public static registerAsEnum<E extends CoreEntity, K extends EntityOrderKey<E>>(this: Constructor<E>, name: string, list: K[]) {
    const result = {} as Record<string, `${K}|${QueryOrder.ASC}` | `${K}|${QueryOrder.DESC}`>;
    for (let value of list) {
      const base_key = value.replace(/\./g, "_");
      const ascending_key = `${base_key}_${QueryOrder.ASC}`;
      const descending_key = `${base_key}_${QueryOrder.DESC}`;
      
      const ascending_value = `${value}|${QueryOrder.ASC}` as `${K}|${QueryOrder.ASC}`;
      const descending_value = `${value}|${QueryOrder.DESC}` as `${K}|${QueryOrder.DESC}`;
      
      result[ascending_key] = ascending_value;
      result[descending_key] = descending_value;
    }
    
    registerEnumType(result, {name});
    return result;
  }
  
}

export interface CoreEntityInitializer {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
}
