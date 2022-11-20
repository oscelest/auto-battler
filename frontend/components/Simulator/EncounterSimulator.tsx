import {Button} from "@noxy/react-button";
import Link from "next/link";
import {HTMLAttributes, useState} from "react";
import {Encounter} from "../../classes";
import {EncounterProgressEvent, EncounterStateChangeEvent} from "../../classes/Encounter/Encounter";
import {
  ComboPointActionEntity,
  DamageActionEntity,
  EffectEntity,
  HealActionEntity,
  NumericalModifierEntity,
  OperationEntity,
  ScalingModifierEntity,
  SkillEntity,
  UnitClassEntity,
  UnitEntity
} from "../../entities";
import EffectActionEntity from "../../entities/Action/EffectActionEntity";
import {PeriodicTriggerEntity} from "../../entities/Trigger";
import {EncounterEventType} from "../../enums";
import DamageElementType from "../../enums/Damage/DamageElementType";
import DamageSourceType from "../../enums/Damage/DamageSourceType";
import SkillType from "../../enums/Discriminator/SkillType";
import EffectAlignmentType from "../../enums/Effect/EffectAlignmentType";
import EncounterStateType from "../../enums/Encounter/EncounterStateType";
import TargetType from "../../enums/Encounter/TargetType";
import IconType from "../../enums/IconType";
import ModifierCategoryType from "../../enums/Modifier/ModifierCategoryType";
import ModifierNumericalType from "../../enums/Modifier/ModifierNumericalType";
import UnitAttributeType from "../../enums/Unit/UnitAttributeType";
import EncounterScene from "../Scene/EncounterScene";
import Icon from "../UI/Icon";
import Style from "./EncounterSimulator.module.scss";

function EncounterSimulator(props: EncounterSimulatorProps) {
  const {className, children, ...component_props} = props;
  
  const [encounter, setEncounter] = useState<Encounter>(generateEncounter());
  const [state, setState] = useState<EncounterStateType>(encounter.state);
  const [tick, setTick] = useState<number>(encounter.tick_count);
  
  const classes = [Style.Component];
  if (className) classes.push(className);
  
  return (
    <div {...component_props} className={classes.join(" ")}>
      
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
    </div>
  );
  
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
    case EncounterStateType.CANCELLED:
    case EncounterStateType.IN_PROGRESS:
    case EncounterStateType.ERROR:
    case EncounterStateType.COMPLETED:
      return true;
    case EncounterStateType.READY:
    case EncounterStateType.PAUSED:
      return false;
  }
}

function getPauseButtonDisabled(state: EncounterStateType) {
  switch (state) {
    case EncounterStateType.READY:
    case EncounterStateType.PAUSED:
    case EncounterStateType.CANCELLED:
    case EncounterStateType.ERROR:
    case EncounterStateType.COMPLETED:
      return true;
    case EncounterStateType.IN_PROGRESS:
      return false;
  }
}

function getStopButtonDisabled(state: EncounterStateType) {
  switch (state) {
    case EncounterStateType.READY:
    case EncounterStateType.CANCELLED:
    case EncounterStateType.ERROR:
    case EncounterStateType.COMPLETED:
      return true;
    case EncounterStateType.IN_PROGRESS:
    case EncounterStateType.PAUSED:
      return false;
  }
}

export default EncounterSimulator;

export interface EncounterSimulatorProps extends HTMLAttributes<HTMLDivElement> {

}

function generatePlayerUnit() {
  return new UnitEntity({
    name: "Player",
    experience: 500,
    class: new UnitClassEntity({
      name: "Knight",
      modifier_list: [
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_HEALTH, value: 100, value_per_level: 25}),
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_ATTACK_POWER, value: 20, value_per_level: 2}),
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_SPELL_POWER, value: 5, value_per_level: 1})
      ]
    }),
    skill_list: [
      new SkillEntity({
        name: "Attack",
        type: SkillType.CHARGE,
        modifier_list: [
          new NumericalModifierEntity({value: 4000, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.CHARGE_SKILL_MAX})
        ],
        operation_list: [
          new OperationEntity({
            target: TargetType.SELF,
            action_list: [
              new ComboPointActionEntity({base_value: 1})
            ]
          }),
          new OperationEntity({
            description: "A simple attack inflicting a damage over time effect and adding a combo point.",
            target: TargetType.ENEMY_SINGLE,
            action_list: [
              new DamageActionEntity({
                direct: true,
                damage_source: DamageSourceType.ATTACK,
                damage_element: DamageElementType.PHYSICAL,
                modifier_list: [
                  new ScalingModifierEntity({value: 0.2, category: ModifierCategoryType.DAMAGE, attribute: UnitAttributeType.ATTACK_POWER})
                ]
              }),
              new DamageActionEntity({
                direct: true,
                damage_source: DamageSourceType.ATTACK,
                damage_element: DamageElementType.PHYSICAL,
                modifier_list: [
                  new ScalingModifierEntity({value: 0.3, category: ModifierCategoryType.DAMAGE, attribute: UnitAttributeType.ATTACK_POWER})
                ]
              }),
              new EffectActionEntity({
                modifier_list: [
                  new NumericalModifierEntity({value: 2000, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.EFFECT_DURATION})
                ],
                effect: new EffectEntity({
                  name: "Damage over Time",
                  expires: true,
                  removable: true,
                  alignment: EffectAlignmentType.NEGATIVE,
                  modifier_list: [],
                  trigger_list: [
                    new PeriodicTriggerEntity({
                      interval: 1000 / 20,
                      operation_list: [
                        new OperationEntity({
                          target: TargetType.SELF,
                          action_list: [
                            new DamageActionEntity({
                              direct: false,
                              periodic: true,
                              damage_source: DamageSourceType.ATTACK,
                              damage_element: DamageElementType.PHYSICAL,
                              modifier_list: [
                                new NumericalModifierEntity({value: 1 / 20, numerical_type: ModifierNumericalType.MULTIPLICATIVE, category: ModifierCategoryType.DAMAGE}),
                                new NumericalModifierEntity({value: 20, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.DAMAGE})
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              })
            ]
          })
        ]
      }),
      new SkillEntity({
        name: "Heal",
        type: SkillType.CHARGE,
        modifier_list: [
          new NumericalModifierEntity({value: 6500, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.CHARGE_SKILL_MAX})
        ],
        operation_list: [
          new OperationEntity({
            description: "Heals self",
            target: TargetType.SELF,
            action_list: [
              new HealActionEntity({
                modifier_list: [
                  new ScalingModifierEntity({value: 1, category: ModifierCategoryType.HEAL, attribute: UnitAttributeType.SPELL_POWER})
                ]
              })
            ]
          })
        ]
      }),
      new SkillEntity({
        name: "Empower",
        type: SkillType.CHARGE,
        modifier_list: [
          new NumericalModifierEntity({value: 2500, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.CHARGE_SKILL_MAX})
        ],
        operation_list: [
          new OperationEntity({
            description: "Buffs self with Empowerment",
            target: TargetType.SELF,
            action_list: [
              new EffectActionEntity({
                modifier_list: [
                  new NumericalModifierEntity({value: 5000, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.EFFECT_DURATION})
                ],
                effect: new EffectEntity({
                  name: "Empowerment",
                  expires: true,
                  removable: true,
                  alignment: EffectAlignmentType.POSITIVE,
                  modifier_list: [
                    new NumericalModifierEntity({value: 0.5, numerical_type: ModifierNumericalType.ADDITIVE, category: ModifierCategoryType.UNIT_ATTRIBUTE_ATTACK_POWER})
                  ]
                })
              })
            ]
          })
        ]
      }),
      new SkillEntity({
        name: "Finisher",
        type: SkillType.COMBO,
        modifier_list: [
          new NumericalModifierEntity({value: 5, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.COMBO_POINT_MAX})
        ],
        operation_list: [
          new OperationEntity({
            description: "Consumes all combo points to deal massive area damage",
            target: TargetType.ENEMY_GROUP,
            action_list: [
              new DamageActionEntity({
                direct: true,
                damage_source: DamageSourceType.ATTACK,
                damage_element: DamageElementType.PHYSICAL,
                modifier_list: [
                  new NumericalModifierEntity({value: 0.5, numerical_type: ModifierNumericalType.ADDITIVE, category: ModifierCategoryType.UNIT_ATTRIBUTE_ATTACK_POWER}),
                  new ScalingModifierEntity({value: 1, category: ModifierCategoryType.DAMAGE, attribute: UnitAttributeType.ATTACK_POWER})
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}

function generateEnemyUnit() {
  return new UnitEntity({
    name: "Enemy",
    experience: 200,
    class: new UnitClassEntity({
      name: "Rat",
      modifier_list: [
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_HEALTH, value: 100, value_per_level: 5}),
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_ATTACK_POWER, value: 10, value_per_level: 2}),
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_SPELL_POWER, value: 5, value_per_level: 1})
      ]
    }),
    skill_list: [
      new SkillEntity({
        name: "Attack",
        type: SkillType.CHARGE,
        modifier_list: [
          new NumericalModifierEntity({value: 3000, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.CHARGE_SKILL_MAX})
        ],
        operation_list: [
          new OperationEntity({
            description: "A simple attack inflicting a damage over time effect and adding a combo point.",
            target: TargetType.PLAYER_SINGLE,
            action_list: [
              new DamageActionEntity({
                direct: true,
                damage_source: DamageSourceType.ATTACK,
                damage_element: DamageElementType.PHYSICAL,
                modifier_list: [
                  new ScalingModifierEntity({value: 0.5, category: ModifierCategoryType.DAMAGE, attribute: UnitAttributeType.ATTACK_POWER})
                ]
              })
            ]
          })
        ]
      })
    ]
  });
}
