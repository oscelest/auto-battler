import ActionType from "../../enums/Discriminator/ActionType";
import {EffectEntity} from "../Effect";
import {ActionEntityInitializer} from "./ActionEntity";
import {ActionEntity} from "./index";

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
