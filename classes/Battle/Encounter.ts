import {EffectEntity, ModifierEntity, UnitEntity} from "../../entities";
import {EncounterEventType} from "../../enums";
import DamageElementType from "../../enums/Encounter/Damage/DamageElementType";
import DamageSourceType from "../../enums/Encounter/Damage/DamageSourceType";
import EncounterStateType from "../../enums/Encounter/EncounterStateType";
import ModifierCategoryType from "../../enums/Encounter/Modifier/ModifierCategoryType";
import SourceType from "../../enums/Encounter/SourceType";
import TargetType from "../../enums/Encounter/TargetType";
import UnitAlignmentType from "../../enums/Encounter/Unit/UnitAlignmentType";
import Modifier from "../../modules/Modifier";
import EventElement, {EventElementInitializer} from "../Base/EventElement";
import {Effect} from "../Effect";
import {Log} from "../Log";
import {LogInitializer} from "../Log/Log";
import Source from "../Source";
import {Unit} from "../Unit";
import {UnitInitializer} from "../Unit/Unit";

export default class Encounter extends EventElement<EncounterEventHandler> {
  
  public static tick_rate: number = 30;                         // 64 updates per second
  public static tick_interval: number = 1000 / this.tick_rate; // Time between ticks in ms
  
  public state: EncounterStateType;
  public tick_count: number;
  public time_started?: Date;
  public time_updated?: Date;
  
  public readonly log: Log;
  public readonly source: Source<SourceType.ENCOUNTER>;
  public readonly unit_list: Unit[];

  constructor(initializer: EncounterInitializer) {
    super(initializer);
    this.state = initializer.state ?? EncounterStateType.READY;
    this.tick_count = initializer.tick_count ?? 0;
    this.time_started = initializer.time_started;
    this.time_updated = initializer.time_updated;
  
    this.log = initializer.log instanceof Log ? initializer.log : new Log(initializer.log);
    this.source = new Source({type: SourceType.ENCOUNTER, value: this});
    this.unit_list = [
      ...initializer.player_unit_list?.map(unit => new Unit(unit instanceof UnitEntity ? this.getUnitInitializer(unit, UnitAlignmentType.PLAYER) : unit)) ?? [],
      ...initializer.enemy_unit_list?.map(unit => new Unit(unit instanceof UnitEntity ? this.getUnitInitializer(unit, UnitAlignmentType.ENEMY) : unit)) ?? []
    ];
  }

  public start() {
    if (this.state !== EncounterStateType.READY) return;

    this.state = EncounterStateType.IN_PROGRESS;
    this.time_started = new Date();
    this.log.writeLine("Encounter started!");

    this.loop();
  }

  public pause() {
    if (this.state !== EncounterStateType.IN_PROGRESS) return;
    this.state = EncounterStateType.PAUSED;
    this.log.writeLine("Encounter paused!");
  }

  public unpause() {
    if (this.state !== EncounterStateType.PAUSED) return;
    this.state = EncounterStateType.IN_PROGRESS;
    this.log.writeLine("Encounter unpaused!");
    this.loop();
  }

  public cancel() {
    if (this.state !== EncounterStateType.IN_PROGRESS) return;
    this.state = EncounterStateType.CANCELLED;
    this.log.writeLine("Encounter cancelled!");
  }

  public end(won: boolean) {
    if (this.state !== EncounterStateType.IN_PROGRESS) return;
  
    const started = this.time_started?.getTime() ?? Date.now();
    const current = Date.now() - started;
    const total = (current / 1000).toFixed(1);
  
    this.state = EncounterStateType.COMPLETED;
    this.log.writeLine(`Battle ${won ? "won" : "lost"} after ${total} seconds!`);
  
    console.log(this.log.toString());
  }
  
  public applyDamageTo(target_unit: Unit, pre_mitigation_value: number, damage_source: DamageSourceType, damage_element: DamageElementType, direct: boolean, source: Source = this.source) {
    target_unit.receiveDamageFrom(source, pre_mitigation_value, damage_source, damage_element, direct);
  }
  
  public applyHealingTo(target_unit: Unit, pre_mitigation_value: number, reviving: boolean, source: Source = this.source) {
    target_unit.receiveHealingFrom(source, pre_mitigation_value, reviving);
  }
  
  public applyComboPointTo(target_unit: Unit, pre_mitigation_value: number, chainable: boolean, source: Source = this.source) {
    target_unit.receiveComboPointFrom(source, pre_mitigation_value, chainable);
  }
  
  public applyEffectTo(target_unit: Unit, entity: EffectEntity, duration: number, source: Source) {
    target_unit.receiveEffectFrom(source, new Effect({entity, unit: target_unit, duration, source}));
  }
  
  public getTargetList(type: TargetType, modifier_list: ModifierEntity[], self_unit: Unit, source: Source): Unit[] {
    const hit_count = Modifier.getCategoryValue(ModifierCategoryType.HIT_COUNT, modifier_list, source.unit) + 1;
    if (!hit_count) return [];
    if (type === TargetType.SELF) return Array(hit_count).fill(self_unit);
    
    // TODO: Skills should have priority, and it should be applied here
    const base_list = this.fromTargetTypeToList(type).filter(unit => unit.health > 0);
    if (!base_list.length) return [];

    switch (type) {
      case TargetType.ANY_SINGLE:
      case TargetType.ENEMY_SINGLE:
      case TargetType.PLAYER_SINGLE:
        return Array(hit_count).fill(base_list[0]);
      case TargetType.ANY_CHAIN:
      case TargetType.ENEMY_CHAIN:
      case TargetType.PLAYER_CHAIN:
        return [...Array(hit_count)].map((v, i) => base_list[i % base_list.length]);
      case TargetType.ANY_GROUP:
      case TargetType.ENEMY_GROUP:
      case TargetType.PLAYER_GROUP:
        return [...Array(hit_count)].reduce(result => [...result, ...base_list], []);
    }
    
    throw new Error(`TargetType '${type}' with HitCount '${hit_count}' is not valid and could not be converted to BattleUnit[]`);
  }
  
  private loop() {
    if (this.state !== EncounterStateType.IN_PROGRESS) return;
    
    this.trigger(EncounterEventType.PROGRESS, {encounter: this});
    this.tick_count++;
    this.time_updated = new Date();
    
    if (!this.unit_list.filter(unit => unit.alignment === UnitAlignmentType.ENEMY && unit.health > 0).length) {
      return this.end(true);
    }
    if (!this.unit_list.filter(unit => unit.alignment === UnitAlignmentType.PLAYER && unit.health > 0).length) {
      return this.end(false);
    }
    
    setTimeout(() => this.loop(), Encounter.tick_interval);
  }
  
  public fromTargetTypeToList(type: TargetType): Unit[] {
    switch (type) {
      case TargetType.ANY_SINGLE:
      case TargetType.ANY_CHAIN:
      case TargetType.ANY_GROUP:
        return this.unit_list;
      case TargetType.ENEMY_SINGLE:
      case TargetType.ENEMY_CHAIN:
      case TargetType.ENEMY_GROUP:
        return this.unit_list.filter(unit => unit.alignment === UnitAlignmentType.ENEMY);
      case TargetType.PLAYER_SINGLE:
      case TargetType.PLAYER_CHAIN:
      case TargetType.PLAYER_GROUP:
        return this.unit_list.filter(unit => unit.alignment === UnitAlignmentType.PLAYER);
    }

    throw new Error(`Target type '${type}' is not valid and could not be converted to BattleUnit[]`);
  }

  private getUnitInitializer(entity: UnitEntity, alignment: UnitAlignmentType) {
    return {entity, alignment, encounter: this};
  }
}

export interface EncounterInitializer extends EventElementInitializer {
  state?: EncounterStateType;
  tick_count?: number;
  time_started?: Date;
  time_updated?: Date;

  log?: Log | LogInitializer;
  player_unit_list?: (UnitEntity | UnitInitializer)[];
  enemy_unit_list?: (UnitEntity | UnitInitializer)[];
}

type EncounterEventHandler = {
  [EncounterEventType.PROGRESS]: (event: EncounterProgressEvent) => void
}

export interface EncounterProgressEvent {
  encounter: Encounter;
}
