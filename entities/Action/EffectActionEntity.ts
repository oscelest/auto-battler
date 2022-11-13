import ActionType from "../../enums/Encounter/ActionType";
import {EffectEntity} from "../Effect";
import {ActionEntity, ActionEntityInitializer} from "./index";

export default class EffectActionEntity extends ActionEntity {
  
  public effect: EffectEntity;
  
  constructor(initializer: EffectActionEntityInitializer) {
    super(ActionType.EFFECT, initializer);
    
    this.effect = initializer.effect;
  }
}

export interface EffectActionEntityInitializer extends ActionEntityInitializer {
  effect: EffectEntity;
}
