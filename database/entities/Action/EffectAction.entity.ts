import {Entity, ManyToOne} from "@mikro-orm/core";
import {ActionType} from "../../enums";
import EffectEntity from "../Effect/Effect.entity";
import  {ActionEntity, ActionEntityInitializer} from "./Action.entity";

@Entity({
  discriminatorValue: ActionType.EFFECT
})
export class EffectActionEntity extends ActionEntity {
  
  @ManyToOne(() => EffectEntity)
  public effect: EffectEntity;
  
  constructor(initializer: EffectActionEntityInitializer) {
    super(ActionType.EFFECT, initializer);
    
    this.effect = initializer.effect;
  }
}

export interface EffectActionEntityInitializer extends ActionEntityInitializer {
  effect: EffectEntity;
}
