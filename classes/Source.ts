import SourceType from "../enums/SourceType";
import {Encounter} from "./Battle";
import {Skill} from "./Skill";
import {Unit} from "./Unit";

export default class Source<Type extends keyof SourceMap = SourceType> {

  public readonly type: Type;
  public readonly value: SourceMap[Type];

  constructor(initializer: SourceInitializer<Type>) {
    this.type = initializer.type;
    this.value = initializer.value;
  }

  public get unit() {
    return this.type === SourceType.UNIT ? this.value as Unit : undefined;
  }

  public get skill() {
    return this.type === SourceType.SKILL ? this.value as Skill : undefined;
  }

  public get encounter() {
    return this.type === SourceType.ENCOUNTER ? this.value as Encounter : undefined;
  }

}

export interface SourceInitializer<Type extends keyof SourceMap> {
  type: Type;
  value: SourceMap[Type];
}

export interface SourceMap {
  [SourceType.UNIT]: Unit;
  [SourceType.SKILL]: Skill;
  [SourceType.ENCOUNTER]: Encounter;
}
