import {Collection, EntityManager} from "@mikro-orm/core";
import {YogaInitialContext} from "graphql-yoga/typings/types";
import Koa from "koa";
import {CoreEntity} from "./entities";
import {QueryOrder} from "./enums";

interface GraphQLContext extends Koa.ParameterizedContext, YogaInitialContext {
  entity_manager: EntityManager;
}

type Properties<E extends {id: string}> = { [K in keyof Pick<E, { [K in keyof E]: E[K] extends Function ? never : K }[keyof E]>]: E[K] };

type NonCoreEntityProps<V extends {id: string}, E = CoreEntity<V>> = Omit<V, "id" | "created_at" | "updated_at">

type ValidatorEntityValue<V> = V extends Collection<infer R> ? R extends CoreEntity<R> ? string[] : R[] : V extends CoreEntity<V> ? string : V

type ValidatorEntityProps<V> = { [K in keyof V]: ValidatorEntityValue<V[K]> };

type EntityProps<V extends {id: string}, E = CoreEntity<V>> = Partial<ValidatorEntityProps<Properties<NonCoreEntityProps<V>>>>

type SearchProps<V extends object> = keyof V | `-${keyof V}`

type OrderByProps<O extends CoreEntity> = { [K in keyof Properties<O>]?: QueryOrder }

type Unwrap<A> = A extends Array<infer R> | Collection<infer R> ? R : A;

type EntityOrderKey<T extends CoreEntity, K = keyof T> =
  K extends string
  ? T[K] extends Function ? never :
    ExtendEntityOrderKey<Unwrap<T[K]>, K>
  : never

type ExtendEntityOrderKey<A, K extends string> = A extends CoreEntity ? `${K}.${EntityOrderKey<A>}` : K
