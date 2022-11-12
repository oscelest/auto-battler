import EffectType from "../../enums/EffectType";
import EffectAlignment from "../../enums/StatusEffect/StatusEffectAlignment";
import {ModifierEntity} from "../Modifier";
import {TriggerEntity} from "../Trigger";

export default abstract class EffectEntity {

  public type: EffectType;

  public name: string;
  public expires: boolean;
  public removable: boolean;
  public alignment: EffectAlignment;

  public modifier_list: ModifierEntity[];
  public trigger_list: TriggerEntity[];

  protected constructor(type: EffectType, initializer: EffectEntityInitializer) {
    this.type = type;
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
  alignment: EffectAlignment;

  modifier_list?: ModifierEntity[];
  trigger_list?: TriggerEntity[];
}
