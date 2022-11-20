import {EffectEntity} from "../Effect/Effect.entity";
import {ActionEntity} from "./Action.entity";

export interface EffectActionEntity extends ActionEntity {
  effect: EffectEntity;
}
