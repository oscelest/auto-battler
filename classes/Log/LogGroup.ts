import ActionType from "../../enums/ActionType";
import {ComboPointLogInstance, DamageLogInstance, HealLogInstance, LogInstance, StatusEffectLogInstance} from "./Instance";

export default class LogGroup {

  public [ActionType.COMBO_POINT]!: ComboPointLogInstance;
  public [ActionType.DAMAGE]!: DamageLogInstance;
  public [ActionType.HEAL]!: HealLogInstance;
  public [ActionType.EFFECT]!: StatusEffectLogInstance;

  constructor(initializer: LogGroupInitializer = {}) {
    this[ActionType.COMBO_POINT] = initializer[ActionType.COMBO_POINT] ?? new ComboPointLogInstance();
    this[ActionType.DAMAGE] = initializer[ActionType.DAMAGE] ?? new DamageLogInstance();
    this[ActionType.HEAL] = initializer[ActionType.HEAL] ?? new HealLogInstance();
    this[ActionType.EFFECT] = initializer[ActionType.EFFECT] ?? new StatusEffectLogInstance();
  }

  public addInstance(instance: LogInstance) {
    switch (instance.type) {
      case ActionType.COMBO_POINT:
        this[ActionType.COMBO_POINT].addInstance(instance as ComboPointLogInstance);
        break;
      case ActionType.DAMAGE:
        this[ActionType.DAMAGE].addInstance(instance as DamageLogInstance);
        break;
      case ActionType.HEAL:
        this[ActionType.HEAL].addInstance(instance as HealLogInstance);
        break;
      case ActionType.EFFECT:
        this[ActionType.EFFECT].addInstance(instance as StatusEffectLogInstance);
        break;
    }

    return this;
  }

  public incrementByGroup(...effect_list: LogGroup[]) {
    for (let effect of effect_list) {
      this.addInstance(effect[ActionType.COMBO_POINT]);
      this.addInstance(effect[ActionType.DAMAGE]);
      this.addInstance(effect[ActionType.HEAL]);
      this.addInstance(effect[ActionType.EFFECT]);
    }

    return this;
  }

  public toStringList() {
    const text = [] as string[];

    const damage_text = this[ActionType.DAMAGE].toString();
    if (damage_text) text.push(damage_text);

    const heal_text = this[ActionType.HEAL].toString();
    if (heal_text) text.push(heal_text);

    const combo_point_text = this[ActionType.COMBO_POINT].toString();
    if (combo_point_text) text.push(combo_point_text);

    const status_effect_text = this[ActionType.EFFECT].toString();
    if (status_effect_text) text.push(status_effect_text);

    return text;
  }

  public toString() {
    this.toStringList().join("\n");
  }
}

export interface LogGroupInitializer {
  [ActionType.COMBO_POINT]?: ComboPointLogInstance;
  [ActionType.DAMAGE]?: DamageLogInstance;
  [ActionType.HEAL]?: HealLogInstance;
  [ActionType.EFFECT]?: StatusEffectLogInstance;
}
