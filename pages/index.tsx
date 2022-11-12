import {Button} from "@noxy/react-button";
import type {GetStaticPropsContext, NextPage} from "next";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import React, {useState} from "react";
import {Encounter} from "../classes";
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
import DamageElementType from "../enums/Damage/DamageElementType";
import DamageSourceType from "../enums/Damage/DamageSourceType";
import EncounterStateType from "../enums/EncounterStateType";
import ModifierCategory from "../enums/Modifier/ModifierCategory";
import ModifierNumericalType from "../enums/Modifier/ModifierNumericalType";
import StatusEffectAlignment from "../enums/StatusEffect/StatusEffectAlignment";
import TargetType from "../enums/TargetType";
import UnitAttributeType from "../enums/Unit/UnitAttributeType";
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
  const [battle, setBattle] = useState<Encounter>();
  const [, setLastUpdated] = useState<Date>(new Date());

  return (
    <div className={Style.Component}>
      <div className={Style.Controls}>
        <Button onClick={clickGenerateBattleButton} disabled={battle?.state !== EncounterStateType.IN_PROGRESS}>Generate new battle</Button>
        <Button onClick={clickStartBattleButton} disabled={battle?.state !== EncounterStateType.READY}>Start Battle</Button>
        <Button onClick={clickCancelBattleButton} disabled={battle?.state !== EncounterStateType.IN_PROGRESS}>Cancel Battle</Button>
      </div>
      <BattleScene battle={battle}/>
    </div>
  );

  function clickGenerateBattleButton() {
    battle?.cancel();
    setBattle(new Encounter({
      // battle_loop: new CombatLoop({
      //   player_unit_list: [generatePlayerUnit()],
      //   enemy_unit_list: [generateEnemyUnit()]
      // })
    }));
  }

  function clickStartBattleButton() {
    battle?.start();
  }

  function clickCancelBattleButton() {
    battle?.log.toString();
    battle?.cancel();
  }

  function onBattleCallback(battle: Encounter) {
    setLastUpdated(battle.time_updated ?? new Date());
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
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategory.UNIT_ATTRIBUTE_HEALTH, value: 100, value_per_level: 25}),
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategory.UNIT_ATTRIBUTE_ATTACK_POWER, value: 20, value_per_level: 2}),
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategory.UNIT_ATTRIBUTE_SPELL_POWER, value: 5, value_per_level: 1})
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
                  new ScalingModifierEntity({value: 0.5, category: ModifierCategory.DAMAGE, attribute: UnitAttributeType.ATTACK_POWER})
                ]
              })
            ],
            effect_list: [
              new EffectEntity({
                name: "Damage over Time",
                expires: true,
                removable: true,
                alignment: StatusEffectAlignment.NEGATIVE,
                modifier_list: [
                  new NumericalModifierEntity({value: 2000, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategory.EFFECT_DURATION})
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
                              new NumericalModifierEntity({value: 1 / 20, numerical_type: ModifierNumericalType.MULTIPLICATIVE, category: ModifierCategory.DAMAGE}),
                              new NumericalModifierEntity({value: 20, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategory.DAMAGE})
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
                  new ScalingModifierEntity({value: 1, category: ModifierCategory.HEAL, attribute: UnitAttributeType.SPELL_POWER})
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
                alignment: StatusEffectAlignment.POSITIVE,
                modifier_list: [
                  new NumericalModifierEntity({value: 5000, numerical_type: ModifierNumericalType.FLAT, category: ModifierCategory.EFFECT_DURATION}),
                  new NumericalModifierEntity({value: 0.5, numerical_type: ModifierNumericalType.ADDITIVE, category: ModifierCategory.UNIT_ATTRIBUTE_ATTACK_POWER})
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
                  new ScalingModifierEntity({value: 1, category: ModifierCategory.DAMAGE, attribute: UnitAttributeType.ATTACK_POWER})
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
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategory.UNIT_ATTRIBUTE_HEALTH, value: 100, value_per_level: 5}),
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategory.UNIT_ATTRIBUTE_ATTACK_POWER, value: 10, value_per_level: 2}),
        new NumericalModifierEntity({numerical_type: ModifierNumericalType.FLAT, category: ModifierCategory.UNIT_ATTRIBUTE_SPELL_POWER, value: 5, value_per_level: 1})
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
                  new ScalingModifierEntity({value: 0.5, category: ModifierCategory.DAMAGE, attribute: UnitAttributeType.ATTACK_POWER})
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
