import EffectAlignmentType from "../../enums/Encounter/Effect/EffectAlignmentType";
import {ModifierEntity} from "../Modifier";
import {TriggerEntity} from "../Trigger";

export default class EffectEntity {

  public name: string;
  public expires: boolean;
  public removable: boolean;
  public alignment: EffectAlignmentType;

  public modifier_list: ModifierEntity[];
  public trigger_list: TriggerEntity[];

  constructor(initializer: EffectEntityInitializer) {
    this.name = initializer.name;
    this.expires = initializer.expires;
    this.removable = initializer.removable;
    this.alignment = initializer.alignment;

    this.modifier_list = initializer.modifier_list ?? [];
    this.trigger_list = initializer.trigger_list ?? [];
  }
}

export interface EffectEntityInitializer {
  name: string;
  expires: boolean;
  removable: boolean;
  alignment: EffectAlignmentType;
  
  modifier_list?: ModifierEntity[];
  trigger_list?: TriggerEntity[];
}
