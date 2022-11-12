import {EncounterEffectEntity} from "../../entities";
import Effect, {EffectInitializer} from "./Effect";

export default class EncounterEffect extends Effect<EncounterEffectEntity> {

  constructor(initializer: EncounterEffectInitializer) {
    super(initializer);
  }

}

export interface EncounterEffectInitializer extends EffectInitializer<EncounterEffectEntity> {

}
