import {Collection, EntityManager} from "@mikro-orm/core";
import {YogaInitialContext} from "graphql-yoga/typings/types";
import Koa from "koa";
import {CoreEntity} from "./entities";

interface GraphQLContext extends Koa.ParameterizedContext, YogaInitialContext {
  entity_manager: EntityManager;
}

type Properties<E> = { [K in keyof Pick<E, { [K in keyof E]: E[K] extends Function ? never : K }[keyof E]>]: E[K] };

type NonCoreEntityProps<V extends {id: string}, E = CoreEntity<V>> = Omit<V, "id" | "created_at" | "updated_at">

type ValidatorEntityValue<V> = V extends Collection<infer R> ? R extends CoreEntity<R> ? string[] : R[] : V extends CoreEntity<V> ? string : V

type ValidatorEntityProps<V> = { [K in keyof V]: ValidatorEntityValue<V[K]> };

type EntityProps<V extends {id: string}, E = CoreEntity<V>> = Partial<ValidatorEntityProps<Properties<NonCoreEntityProps<V>>>>

type SearchProps<V extends object> = keyof V | `-${keyof V}`
