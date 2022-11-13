enum UnitEventType {
  KILL                 = "kill",
  KILLED               = "killed",
  REVIVE_APPLIED       = "reviving",
  REVIVE_RECEIVED      = "revived",
  DAMAGE_APPLIED       = "damage_applied",
  DAMAGE_RECEIVED      = "damage_received",
  HEALING_APPLIED      = "healing_applied",
  HEALING_RECEIVED     = "healing_received",
  COMBO_POINT_APPLIED  = "combo_point_applied",
  COMBO_POINT_RECEIVED = "combo_point_received",
}

export default UnitEventType;
