import {v4} from "uuid";
import SourceType from "../enums/SourceType";
import {Encounter} from "./Battle";
import {Effect} from "./Effect";
import {Skill} from "./Skill";
import {Unit} from "./Unit";

export default class Source<Type extends keyof SourceMap = SourceType> {
  
  public readonly id: string;
  public readonly type: Type;
  public readonly value: SourceMap[Type];
  
  constructor(initializer: SourceInitializer<Type>) {
    this.id = v4();
    this.type = initializer.type;
    this.value = initializer.value;
  }
  
  public get effect(): Effect | undefined {
    if (this.type === SourceType.EFFECT) return this.value as Effect;
    return undefined;
  }
  
  public get skill(): Skill | undefined {
    if (this.type === SourceType.SKILL) return this.value as Skill;
    return undefined;
  }
  
  public get unit(): Unit | undefined {
    if (this.type === SourceType.UNIT) return this.value as Unit;
    if (this.type === SourceType.SKILL) return this.skill?.unit;
    if (this.type === SourceType.EFFECT) return this.effect?.unit;
    return undefined;
  }
  
  public get encounter(): Encounter | undefined {
    if (this.type === SourceType.ENCOUNTER) return this.value as Encounter;
    if (this.type === SourceType.UNIT) return this.unit?.encounter;
    if (this.type === SourceType.SKILL) return this.skill?.unit.encounter;
    if (this.type === SourceType.EFFECT) return this.effect?.unit.encounter;
    return undefined;
  }
  
  public toString() {
    return this.value.toString();
  }
  
}

export interface SourceInitializer<Type extends keyof SourceMap> {
  type: Type;
  value: SourceMap[Type];
}

export interface SourceMap {
  [SourceType.UNIT]: Unit;
  [SourceType.SKILL]: Skill;
  [SourceType.EFFECT]: Effect;
  [SourceType.ENCOUNTER]: Encounter;
}
