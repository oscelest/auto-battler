import {SkillEventType} from "../../enums";
import ModifierCategoryType from "../../enums/Encounter/Modifier/ModifierCategoryType";
import {ComboPointLogEntry} from "../Log";
import {Source} from "../Source";
import {UnitComboPointAction} from "../Unit/Unit";
import Skill, {SkillInitializer} from "./Skill";

export default class ComboSkill extends Skill {
  
  public combo_point_current: number;
  
  constructor(initializer: ComboSkillInitializer) {
    super(initializer);
    this.combo_point_current = initializer.combo_current ?? 0;
    
    this.on(SkillEventType.COMBO_POINT_RECEIVED, this.onComboPointReceived);
  }
  
  public get combo_point_max() {
    return this.getCategoryValue(ModifierCategoryType.COMBO_POINT_MAX, this.unit);
  }
  
  public receiveComboPointFrom(source: Source, action: UnitComboPointAction) {
    const received_value = Math.max(-this.combo_point_current, Math.min(action.applied_value, Math.max(0, this.combo_point_max - this.combo_point_current)));
    
    this.combo_point_current += received_value;
    if (received_value !== 0) {
      this.unit.encounter.log.writeEntry(source, new ComboPointLogEntry({...action, target_skill: this, received_value, source}));
      this.trigger(SkillEventType.COMBO_POINT_RECEIVED, {...action, skill: this, received_value});
    }
  }
  
  private readonly onComboPointReceived = () => {
    const combo_point_max = this.combo_point_max;
    if (this.combo_point_current >= combo_point_max) {
      
      const combo_point_retain = this.getCategoryValue(ModifierCategoryType.COMBO_POINT_RETAIN, this.unit);
      const applied_value = Math.min(combo_point_retain, combo_point_max - 1);
      
      this.trigger(SkillEventType.USE, {skill: this});
      if (applied_value > 0) {
        this.unit.applyComboPointTo(this.unit, {applied_value, retained: true, periodic: false}, this.source);
      }
    }
  };
}

export interface ComboSkillInitializer extends SkillInitializer {
  combo_current?: number;
}
