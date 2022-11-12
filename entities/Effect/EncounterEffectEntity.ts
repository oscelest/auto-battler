import EffectType from "../../enums/EffectType";
import {EffectEntityInitializer} from "./EffectEntity";
import {EffectEntity} from "./index";

export default class EncounterEffectEntity extends EffectEntity {

  constructor(initializer: EncounterEffectEntityInitializer) {
    super(EffectType.ENCOUNTER, initializer);
  }
}

export interface EncounterEffectEntityInitializer extends EffectEntityInitializer {

}
