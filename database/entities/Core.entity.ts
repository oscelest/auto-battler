import {BaseEntity, Collection, Entity, PrimaryKey, Property} from "@mikro-orm/core";
import {GraphQLResolveInfo, Kind, SelectionSetNode} from "graphql/index";
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
  
  public static fromContextToFieldsAndPopulate<E extends CoreEntity<E>>(this: Constructor<E>, info: GraphQLResolveInfo): ASTQuery<DeepKey<E>, DeepKey<E>> {
    const $this = (CoreEntity as typeof CoreEntity & Constructor<E>);
    const {fields, populate} = info.fieldNodes.reduce(
      (result, node) => {
        const {fields, populate} = $this.getNodes<E>(node.selectionSet);
        result.fields.push(...fields);
        result.populate.push(...populate);
        return result;
      },
      {fields: [], populate: []} as ASTQuery<DeepKey<E>, DeepKey<E>>
    );
    
    return {fields: fields.filter($this.onlyUnique), populate: populate.filter($this.onlyUnique)};
  }
  
  public static getNodes<E extends CoreEntity>(this: Constructor<E>, set?: SelectionSetNode, path: string[] = []): ASTQuery<DeepKey<E>, DeepKey<E>> {
    const $this = (CoreEntity as typeof CoreEntity & Constructor<E>);
    const result = {fields: [], populate: []} as ASTQuery<DeepKey<E>, DeepKey<E>>;
    if (!set) return result;
    
    for (let selection of set.selections) {
      if (selection.kind === Kind.FRAGMENT_SPREAD || selection.kind === Kind.INLINE_FRAGMENT) continue;
      
      const name = selection.name.value;
      const next_set = selection.selectionSet;
      if (next_set) {
        const {fields, populate} = $this.getNodes<E>(next_set, [...path, name]);
        result.populate.push(...populate.map(relation => `${name}.${relation}`) as DeepKey<E>[]);
        result.populate.push(name as DeepKey<E>);
        result.fields.push(...fields);
      }
      else {
        result.fields.push([...path, name].join(".") as DeepKey<E>);
      }
    }
  
    return result;
  }
  
  private static onlyUnique(value: string, index: number, self: string[]) {
    return self.indexOf(value) === index;
  }
  
}

export const CoreEntityPaginationOrder = CoreEntity.registerAsEnum("CoreEntityPaginationOrder", ["id", "created_at", "updated_at"]);

interface ASTQuery<F = any, P = any> {
  fields: F[];
  populate: P[];
}

export interface CoreEntityInitializer {
  id?: string;
  created_at?: Date;
  updated_at?: Date;
}

type DeepKey<T extends object, K extends keyof T = keyof T> =
  K extends string
  ? T[K] extends Function ? never :
    T[K] extends object
    ? T[K] extends Array<infer R> | Collection<infer R>
      ? R extends CoreEntity ? `${K & string}.${DeepKey<R> & string}` : K
      : T[K] extends CoreEntity ? `${K & string}.${DeepKey<T[K]> & string}` : K
    : K
  : never
