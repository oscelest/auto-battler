import {Button} from "@noxy/react-button";
import Link from "next/link";
import {HTMLAttributes, useState} from "react";
import {v4} from "uuid";
import {Encounter} from "../../classes";
import {EncounterProgressEvent, EncounterStateChangeEvent} from "../../classes/Encounter/Encounter";
import {EncounterEventType, EncounterStateType, IconType} from "../../enums";
import {ComboPointActionEntity} from "../../generated/contract/entities/Action/ComboPointAction.entity";
import {DamageActionEntity} from "../../generated/contract/entities/Action/DamageAction.entity";
import {EffectActionEntity} from "../../generated/contract/entities/Action/EffectAction.entity";
import {HealActionEntity} from "../../generated/contract/entities/Action/HealAction.entity";
import {EffectEntity} from "../../generated/contract/entities/Effect/Effect.entity";
import {AttributeModifierEntity} from "../../generated/contract/entities/Modifier/AttributeModifier.entity";
import {NumericalModifierEntity} from "../../generated/contract/entities/Modifier/NumericalModifier.entity";
import {OperationEntity} from "../../generated/contract/entities/Operation/Operation.entity";
import {PeriodicTriggerEntity} from "../../generated/contract/entities/Trigger/PeriodicTrigger.entity";
import {UnitEntity} from "../../generated/contract/entities/Unit/Unit.entity";
import {DamageElementType} from "../../generated/contract/enums/Damage/DamageElementType";
import {DamageSourceType} from "../../generated/contract/enums/Damage/DamageSourceType";
import {ActionType} from "../../generated/contract/enums/Discriminator/ActionType";
import {SkillType} from "../../generated/contract/enums/Discriminator/SkillType";
import {TriggerType} from "../../generated/contract/enums/Discriminator/TriggerType";
import {EffectAlignmentType} from "../../generated/contract/enums/Effect/EffectAlignmentType";
import {ModifierCategoryType} from "../../generated/contract/enums/Modifier/ModifierCategoryType";
import {ModifierNumericalType} from "../../generated/contract/enums/Modifier/ModifierNumericalType";
import {TargetType} from "../../generated/contract/enums/TargetType";
import {UnitAttributeType} from "../../generated/contract/enums/Unit/UnitAttributeType";
import EncounterScene from "../Scene/EncounterScene";
import Icon from "../UI/Icon";
import Style from "./EncounterSimulator.module.scss";

function EncounterSimulator(props: EncounterSimulatorProps) {
  const {className, children, ...component_props} = props;
  
  const [encounter, setEncounter] = useState<Encounter>(generateEncounter());
  const [state, setState] = useState<EncounterStateType>(encounter.state);
  const [, setTick] = useState<number>(encounter.tick_count);
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  return <div {...component_props} className={classes.join(" ")}>
    
    <div className={Style.Controls}>
      <div className={Style.Encounter}>
        <Button className={Style.Generate} onClick={onGenerateEncounterButtonClick}>
          <Icon type={IconType.PLUS}/>
        </Button>
        {
          state === EncounterStateType.IN_PROGRESS
          ? <Button className={Style.Pause} disabled={getPauseButtonDisabled(state)} onClick={onPauseEncounterButtonClick}><Icon type={IconType.UI_PAUSE}/></Button>
          : <Button className={Style.Play} disabled={getPlayButtonDisabled(state)} onClick={onPlayEncounterButtonClick}><Icon type={IconType.UI_PLAY}/></Button>
        }
        <Button className={Style.Stop} disabled={getStopButtonDisabled(state)} onClick={onStopEncounterButtonClick}><Icon type={IconType.UI_STOP}/></Button>
      </div>
      <div className={Style.Data}>
        <Link href={"/admin"}>
          <Button className={Style.LinkButton}>
            <Icon type={IconType.DATABASE}/>
          </Button>
        </Link>
      </div>
    
    
    </div>
    {
      encounter
      ? <EncounterScene encounter={encounter}></EncounterScene>
      : <div className={Style.EncounterFill}/>
    }
  </div>;
  
  function onGenerateEncounterButtonClick() {
    encounter.cancel();
    const next_encounter = generateEncounter();
    setTick(next_encounter.tick_count);
    setState(next_encounter.state);
    setEncounter(next_encounter);
  }
  
  function onPlayEncounterButtonClick() {
    encounter.state === EncounterStateType.PAUSED ? encounter.unpause() : encounter.start();
  }
  
  function onPauseEncounterButtonClick() {
    encounter.pause();
  }
  
  function onStopEncounterButtonClick() {
    encounter.cancel();
  }
  
  function onEncounterProgress(event: EncounterProgressEvent) {
    setTick(event.encounter.tick_count);
  }
  
  function onEncounterStateChange(event: EncounterStateChangeEvent) {
    setState(event.state);
  }
  
  function generateEncounter() {
    return new Encounter({
      player_unit_list: [generatePlayerUnit()],
      enemy_unit_list: [generateEnemyUnit()]
    })
    .on(EncounterEventType.PROGRESS, onEncounterProgress)
    .on(EncounterEventType.STATE_CHANGE, onEncounterStateChange);
  }
}

function getPlayButtonDisabled(state: EncounterStateType) {
  switch (state) {
    case EncounterStateType.READY:
    case EncounterStateType.PAUSED:
      return false;
    default:
      return true;
  }
}

function getPauseButtonDisabled(state: EncounterStateType) {
  switch (state) {
    case EncounterStateType.IN_PROGRESS:
      return false;
    default:
      return true;
  }
}

function getStopButtonDisabled(state: EncounterStateType) {
  switch (state) {
    case EncounterStateType.IN_PROGRESS:
    case EncounterStateType.PAUSED:
      return false;
    default:
      return true;
  }
}

export default EncounterSimulator;

export interface EncounterSimulatorProps extends HTMLAttributes<HTMLDivElement> {

}

function generatePlayerUnit(): UnitEntity {
  return {
    id: v4(),
    name: "Player",
    experience: 500,
    class: {
      id: v4(),
      name: "Knight",
      modifier_list: [
        {numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_HEALTH, value: 100, value_per_level: 25} as NumericalModifierEntity,
        {numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_ATTACK_POWER, value: 20, value_per_level: 2} as NumericalModifierEntity,
        {numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_SPELL_POWER, value: 5, value_per_level: 1} as NumericalModifierEntity
      ],
      created_at: new Date(),
      updated_at: new Date()
    },
    skill_list: [
      {
        id: v4(),
        name: "Attack",
        description: "A simple attack inflicting a damage over time effect and adding a combo point.",
        type: SkillType.CHARGE,
        modifier_list: [
          {value: 4000, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.CHARGE_SKILL_MAX} as NumericalModifierEntity
        ],
        operation_list: [
          {
            id: v4(),
            target: TargetType.SELF,
            action_list: [
              {base_value: 1} as ComboPointActionEntity
            ],
            modifier_list: [],
            created_at: new Date(),
            updated_at: new Date()
          },
          {
            id: v4(),
            target: TargetType.ENEMY_SINGLE,
            modifier_list: [],
            action_list: [
              {
                id: v4(),
                type: ActionType.DAMAGE,
                direct: true,
                periodic: false,
                damage_source: DamageSourceType.ATTACK,
                damage_element: DamageElementType.PHYSICAL,
                modifier_list: [
                  {value: 0.2, category: ModifierCategoryType.DAMAGE, attribute: UnitAttributeType.ATTACK_POWER} as AttributeModifierEntity
                ],
                created_at: new Date(),
                updated_at: new Date()
              } as DamageActionEntity,
              {
                id: v4(),
                type: ActionType.DAMAGE,
                direct: true,
                periodic: false,
                damage_source: DamageSourceType.ATTACK,
                damage_element: DamageElementType.PHYSICAL,
                modifier_list: [
                  {value: 0.3, category: ModifierCategoryType.DAMAGE, attribute: UnitAttributeType.ATTACK_POWER} as AttributeModifierEntity
                ],
                created_at: new Date(),
                updated_at: new Date()
              } as DamageActionEntity,
              {
                id: v4(),
                type: ActionType.EFFECT,
                periodic: false,
                modifier_list: [
                  {value: 2000, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.EFFECT_DURATION} as NumericalModifierEntity
                ],
                effect: {
                  id: v4(),
                  name: "Damage over Time",
                  expires: true,
                  removable: true,
                  alignment: EffectAlignmentType.NEGATIVE,
                  modifier_list: [],
                  trigger_list: [
                    {
                      id: v4(),
                      type: TriggerType.PERIODIC,
                      interval: 1000 / 20,
                      operation_list: [
                        {
                          id: v4(),
                          target: TargetType.SELF,
                          modifier_list: [],
                          action_list: [
                            {
                              id: v4(),
                              type: ActionType.DAMAGE,
                              direct: false,
                              periodic: true,
                              damage_source: DamageSourceType.ATTACK,
                              damage_element: DamageElementType.PHYSICAL,
                              modifier_list: [
                                {value: 1 / 20, numerical_type: ModifierNumericalType.MULTIPLICATIVE, category: ModifierCategoryType.DAMAGE} as NumericalModifierEntity,
                                {value: 20, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.DAMAGE} as NumericalModifierEntity
                              ],
                              created_at: new Date(),
                              updated_at: new Date()
                            } as DamageActionEntity
                          ],
                          created_at: new Date(),
                          updated_at: new Date()
                        } as OperationEntity
                      ],
                      created_at: new Date(),
                      updated_at: new Date()
                    } as PeriodicTriggerEntity
                  ],
                  created_at: new Date(),
                  updated_at: new Date()
                } as EffectEntity,
                created_at: new Date(),
                updated_at: new Date()
              } as EffectActionEntity
            ],
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: v4(),
        name: "Heal",
        description: "",
        type: SkillType.CHARGE,
        modifier_list: [
          {value: 6500, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.CHARGE_SKILL_MAX} as NumericalModifierEntity
        ],
        operation_list: [
          {
            id: v4(),
            target: TargetType.SELF,
            modifier_list: [],
            action_list: [
              {
                id: v4(),
                type: ActionType.HEAL,
                direct: true,
                periodic: false,
                reviving: true,
                modifier_list: [
                  {value: 1, category: ModifierCategoryType.HEAL, attribute: UnitAttributeType.SPELL_POWER} as AttributeModifierEntity
                ],
                created_at: new Date(),
                updated_at: new Date()
              } as HealActionEntity
            ],
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: v4(),
        name: "Empower",
        description: "",
        type: SkillType.CHARGE,
        modifier_list: [
          {value: 2500, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.CHARGE_SKILL_MAX} as NumericalModifierEntity
        ],
        operation_list: [
          {
            id: v4(),
            target: TargetType.SELF,
            modifier_list: [],
            action_list: [
              {
                id: v4(),
                type: ActionType.EFFECT,
                direct: true,
                periodic: false,
                reviving: false,
                modifier_list: [
                  {value: 1, category: ModifierCategoryType.HEAL, attribute: UnitAttributeType.SPELL_POWER} as AttributeModifierEntity
                ],
                effect: {
                  id: v4(),
                  name: "Empowerment",
                  expires: true,
                  removable: true,
                  alignment: EffectAlignmentType.POSITIVE,
                  trigger_list: [],
                  modifier_list: [
                    {value: 0.5, numerical_type: ModifierNumericalType.ADDITIVE, category: ModifierCategoryType.UNIT_ATTRIBUTE_ATTACK_POWER} as NumericalModifierEntity
                  ],
                  created_at: new Date(),
                  updated_at: new Date()
                },
                created_at: new Date(),
                updated_at: new Date()
              } as EffectActionEntity
            ],
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: v4(),
        name: "Finisher",
        description: "Consumes all combo points to deal massive area damage",
        type: SkillType.COMBO,
        modifier_list: [
          {value: 5, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.COMBO_POINT_MAX} as NumericalModifierEntity
        ],
        operation_list: [
          {
            id: v4(),
            target: TargetType.ENEMY_SINGLE,
            modifier_list: [],
            action_list: [
              {
                id: v4(),
                type: ActionType.DAMAGE,
                direct: true,
                periodic: false,
                damage_source: DamageSourceType.ATTACK,
                damage_element: DamageElementType.PHYSICAL,
                modifier_list: [
                  ({value: 0.5, numerical_type: ModifierNumericalType.ADDITIVE, category: ModifierCategoryType.UNIT_ATTRIBUTE_ATTACK_POWER}) as NumericalModifierEntity,
                  ({value: 1, category: ModifierCategoryType.DAMAGE, attribute: UnitAttributeType.ATTACK_POWER}) as AttributeModifierEntity
                ],
                created_at: new Date(),
                updated_at: new Date()
              } as DamageActionEntity
            ],
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        created_at: new Date(),
        updated_at: new Date()
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  };
}

function generateEnemyUnit() {
  return {
    id: v4(),
    name: "Enemy",
    experience: 200,
    class: {
      id: v4(),
      name: "Warrior",
      modifier_list: [
        {numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_HEALTH, value: 100, value_per_level: 5} as NumericalModifierEntity,
        {numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_ATTACK_POWER, value: 10, value_per_level: 2} as NumericalModifierEntity,
        {numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_SPELL_POWER, value: 5, value_per_level: 1} as NumericalModifierEntity
      ],
      created_at: new Date(),
      updated_at: new Date()
    },
    skill_list: [
      {
        id: v4(),
        name: "Slash",
        description: "A simple attack inflicting a damage over time effect and adding a combo point.",
        type: SkillType.CHARGE,
        modifier_list: [
          {value: 3000, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.CHARGE_SKILL_MAX} as NumericalModifierEntity
        ],
        operation_list: [
          {
            id: v4(),
            target: TargetType.ENEMY_SINGLE,
            modifier_list: [],
            action_list: [
              {
                id: v4(),
                type: ActionType.DAMAGE,
                direct: true,
                periodic: false,
                damage_source: DamageSourceType.ATTACK,
                damage_element: DamageElementType.PHYSICAL,
                modifier_list: [
                  {value: 0.5, category: ModifierCategoryType.DAMAGE, attribute: UnitAttributeType.ATTACK_POWER} as AttributeModifierEntity
                ],
                created_at: new Date(),
                updated_at: new Date()
              } as DamageActionEntity
            ],
            created_at: new Date(),
            updated_at: new Date()
          }
        ],
        created_at: new Date(),
        updated_at: new Date()
      }
    ],
    created_at: new Date(),
    updated_at: new Date()
  };
}
