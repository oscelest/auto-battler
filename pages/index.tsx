import {Button} from "@noxy/react-button";
import type {GetStaticPropsContext, NextPage} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {useState} from "react";
import {Encounter} from "../classes";
import {EncounterProgressEvent} from "../classes/Battle/Encounter";
import BattleScene from "../components/Scene/BattleScene";
import {
  ChargeSkillEntity,
  ComboPointActionEntity,
  ComboSkillEntity,
  DamageActionEntity,
  EffectEntity,
  HealActionEntity,
  NumericalModifierEntity,
  OperationEntity,
  ScalingModifierEntity,
  UnitClassEntity,
  UnitEntity
} from "../entities";
import {PeriodicTriggerEntity} from "../entities/Trigger";
import {EncounterEventType} from "../enums";
import DamageElementType from "../enums/Encounter/Damage/DamageElementType";
import DamageSourceType from "../enums/Encounter/Damage/DamageSourceType";
import EffectAlignmentType from "../enums/Encounter/Effect/EffectAlignmentType";
import EncounterStateType from "../enums/Encounter/EncounterStateType";
import ModifierCategoryType from "../enums/Encounter/Modifier/ModifierCategoryType";
import ModifierNumericalType from "../enums/Encounter/Modifier/ModifierNumericalType";
import TargetType from "../enums/Encounter/TargetType";
import UnitAttributeType from "../enums/Encounter/Unit/UnitAttributeType";
import {i18n} from "../next-i18next.config";
import Style from "./index.module.scss";

export async function getStaticProps({locale}: GetStaticPropsContext) {
  return {
    props: {
      ...(await serverSideTranslations(locale ?? i18n.defaultLocale, ["common"]))
    }
  };
}

const IndexPage: NextPage = () => {
  const [encounter, setEncounter] = useState<Encounter>();
  const [encounter_state, setEncounterState] = useState<EncounterStateType>();
  const [tick_count, setTickCount] = useState<number>(0);
  
  return (
    <div className={Style.Component}>
      <div className={Style.Controls}>
        <Button onClick={clickGenerateBattleButton} disabled={encounter?.state !== EncounterStateType.IN_PROGRESS}>Generate new battle</Button>
        <Button onClick={clickStartBattleButton} disabled={encounter?.state !== EncounterStateType.READY}>Start Battle</Button>
        {
          encounter_state === EncounterStateType.IN_PROGRESS &&
          <Button onClick={clickPauseBattleButton}>Pause</Button>
        }
        {
          encounter_state === EncounterStateType.PAUSED &&
          <Button onClick={clickPauseBattleButton}>Unpause</Button>
        }
        {
          encounter_state === EncounterStateType.IN_PROGRESS &&
          <Button onClick={clickCancelBattleButton}>Cancel Battle</Button>
        }
        <span>Tick: {tick_count}</span>
      </div>
      <BattleScene battle={encounter}/>
    </div>
  );
  
  function cancel() {
    encounter?.off(EncounterEventType.PROGRESS, onEncounterProgress);
    encounter?.cancel();
    setEncounter(undefined);
    setEncounterState(EncounterStateType.CANCELLED);
  }
  
  function clickGenerateBattleButton() {
    cancel();
    
    setEncounter(
      new Encounter({
        player_unit_list: [generatePlayerUnit()],
        enemy_unit_list: [generateEnemyUnit()]
      })
      .on(EncounterEventType.PROGRESS, onEncounterProgress)
    );
    setEncounterState(EncounterStateType.READY);
  }
  
  function clickStartBattleButton() {
    encounter?.start();
    setEncounterState(EncounterStateType.IN_PROGRESS);
    
  }
  
  function clickPauseBattleButton() {
    if (encounter?.state === EncounterStateType.IN_PROGRESS) {
      encounter?.pause();
      console.log(encounter);
      setEncounterState(EncounterStateType.PAUSED);
    }
    else {
      encounter?.unpause();
      setEncounterState(EncounterStateType.IN_PROGRESS);
    }
  }
  
  function clickCancelBattleButton() {
    encounter?.log.toString();
    cancel();
  }
  
  
  function onEncounterProgress({encounter}: EncounterProgressEvent) {
    setTickCount(encounter.tick_count);
  }
};

function generatePlayerUnit() {
  return new UnitEntity({
    name: "Player",
    experience: 500,
    modifier_list: [],
    class: new UnitClassEntity({
      name: "Knight",
      modifier_list: [
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_HEALTH, value: 100, value_per_level: 25}),
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_ATTACK_POWER, value: 20, value_per_level: 2}),
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_SPELL_POWER, value: 5, value_per_level: 1})
      ]
    }),
    skill_list: [
      new ChargeSkillEntity({
        name: "Attack",
        charge_base: 4000,
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
                source_type: DamageSourceType.ATTACK,
                element_type: DamageElementType.PHYSICAL,
                modifier_list: [
                  new ScalingModifierEntity({value: 0.5, category: ModifierCategoryType.DAMAGE, attribute: UnitAttributeType.ATTACK_POWER})
                ]
              })
            ],
            effect_list: [
              new EffectEntity({
                name: "Damage over Time",
                expires: true,
                removable: true,
                alignment: EffectAlignmentType.NEGATIVE,
                modifier_list: [
                  new NumericalModifierEntity({value: 2000, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.EFFECT_DURATION})
                ],
                trigger_list: [
                  new PeriodicTriggerEntity({
                    interval: 1000 / 20,
                    operation_list: [
                      new OperationEntity({
                        target: TargetType.SELF,
                        action_list: [
                          new DamageActionEntity({
                            direct: false,
                            source_type: DamageSourceType.ATTACK,
                            element_type: DamageElementType.PHYSICAL,
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
            ]
          })
        ]
      }),
      new ChargeSkillEntity({
        name: "Heal",
        charge_base: 6500,
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
      new ChargeSkillEntity({
        name: "Empower",
        charge_base: 2500,
        operation_list: [
          new OperationEntity({
            description: "Buffs self with Empowerment",
            target: TargetType.SELF,
            effect_list: [
              new EffectEntity({
                name: "Empowerment",
                expires: true,
                removable: true,
                alignment: EffectAlignmentType.POSITIVE,
                modifier_list: [
                  new NumericalModifierEntity({value: 5000, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.EFFECT_DURATION}),
                  new NumericalModifierEntity({value: 0.5, numerical_type: ModifierNumericalType.ADDITIVE, category: ModifierCategoryType.UNIT_ATTRIBUTE_ATTACK_POWER})
                ]
              })
            ]
          })
        ]
      }),
      new ComboSkillEntity({
        name: "Finisher",
        combo_base: 5,
        operation_list: [
          new OperationEntity({
            description: "Consumes all combo points to deal massive area damage",
            target: TargetType.ENEMY_GROUP,
            action_list: [
              new DamageActionEntity({
                direct: true,
                source_type: DamageSourceType.ATTACK,
                element_type: DamageElementType.PHYSICAL,
                modifier_list: [
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
    modifier_list: [],
    class: new UnitClassEntity({
      name: "Rat",
      modifier_list: [
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_HEALTH, value: 100, value_per_level: 5}),
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_ATTACK_POWER, value: 10, value_per_level: 2}),
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategoryType.UNIT_ATTRIBUTE_SPELL_POWER, value: 5, value_per_level: 1})
      ]
    }),
    skill_list: [
      new ChargeSkillEntity({
        name: "Attack",
        charge_base: 3000,
        operation_list: [
          new OperationEntity({
            description: "A simple attack inflicting a damage over time effect and adding a combo point.",
            target: TargetType.PLAYER_SINGLE,
            action_list: [
              new DamageActionEntity({
                direct: true,
                source_type: DamageSourceType.ATTACK,
                element_type: DamageElementType.PHYSICAL,
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

export default IndexPage;
