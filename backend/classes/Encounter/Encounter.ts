import {EncounterEventType, EncounterStateType, SourceType, UnitAlignmentType} from "../../enums";
import {EffectEntity, ModifierCategoryType, ModifierEntity, TargetType, UnitEntity} from "../../gql/sdk";
import Modifier from "../../modules/Modifier";
import EventElement, {EventElementInitializer} from "../Base/EventElement";
import {Effect} from "../Effect";
import {Log} from "../Log";
import {LogInitializer} from "../Log/Log";
import Source from "../Source/Source";
import {Unit} from "../Unit";
import {isUnitEntity, UnitComboPointAction, UnitDamageAction, UnitHealAction, UnitInitializer} from "../Unit/Unit";

export default class Encounter extends EventElement<EncounterEventHandler> {
  
  public static tick_rate: number = 60;                        // 64 updates per second
  public static tick_interval: number = 1000 / this.tick_rate; // Time between ticks in ms
  
  public state: EncounterStateType;
  public tick_count: number;
  public time_started?: Date;
  public time_updated?: Date;
  
  public readonly log: Log;
  public readonly reference: Source<SourceType.ENCOUNTER>;
  public readonly unit_list: Unit[];
  
  constructor(initializer: EncounterInitializer) {
    super(initializer);
    this.state = initializer.state ?? EncounterStateType.READY;
    this.tick_count = initializer.tick_count ?? 0;
    this.time_started = initializer.time_started;
    this.time_updated = initializer.time_updated;
    
    this.log = initializer.log instanceof Log ? initializer.log : new Log(initializer.log);
    this.reference = new Source({type: SourceType.ENCOUNTER, value: this});
    this.unit_list = [
      ...initializer.player_unit_list?.map(entity => new Unit(isUnitEntity(entity) ? {entity, encounter: this, alignment: UnitAlignmentType.PLAYER} : entity)) ?? [],
      ...initializer.enemy_unit_list?.map(entity => new Unit(isUnitEntity(entity) ? {entity, encounter: this, alignment: UnitAlignmentType.ENEMY} : entity)) ?? []
    ];
  }
  
  public start() {
    if (this.state !== EncounterStateType.READY) return;
    
    this.time_started = new Date();
    this.setState(EncounterStateType.IN_PROGRESS);
    
    this.loop();
  }
  
  public pause() {
    if (this.state !== EncounterStateType.IN_PROGRESS) return;
    this.setState(EncounterStateType.PAUSED);
  }
  
  public unpause() {
    if (this.state !== EncounterStateType.PAUSED) return;
    this.setState(EncounterStateType.IN_PROGRESS);
    this.loop();
  }
  
  public cancel() {
    if (this.state !== EncounterStateType.IN_PROGRESS) return;
    this.setState(EncounterStateType.CANCELLED);
  }
  
  public end(won: boolean) {
    if (this.state !== EncounterStateType.IN_PROGRESS) return;
    
    const started = this.time_started?.getTime() ?? Date.now();
    const current = Date.now() - started;
    const total = (current / 1000).toFixed(1);
    
    this.setState(EncounterStateType.COMPLETED);
    this.log.writeLine(`Battle ${won ? "won" : "lost"} after ${total} seconds!`);
    
    console.log(this.log.log_section_list);
    
    this.trigger(EncounterEventType.PROGRESS, {encounter: this});
  }
  
  public applyDamageTo(target_unit: Unit, action: UnitDamageAction, source: Source = this.reference) {
    target_unit.receiveDamageFrom(source, action);
  }
  
  public applyHealingTo(target_unit: Unit, action: UnitHealAction, source: Source = this.reference) {
    target_unit.receiveHealingFrom(source, action);
  }
  
  public applyComboPointTo(target_unit: Unit, action: UnitComboPointAction, source: Source = this.reference) {
    target_unit.receiveComboPointFrom(source, action);
  }
  
  public applyEffectTo(target_unit: Unit, entity: EffectEntity, duration: number, source: Source = this.reference) {
    target_unit.receiveEffectFrom(source, new Effect({entity, unit: target_unit, duration, source}));
  }
  
  public getTargetList(type: TargetType, modifier_list: ModifierEntity[], self_unit: Unit, source: Source): Unit[] {
    const hit_count = Modifier.getCategoryValue(ModifierCategoryType.HitCount, modifier_list, source.unit) + 1;
    if (!hit_count) return [];
    if (type === TargetType.Self) return Array(hit_count).fill(self_unit);
    
    // TODO: Skills should have priority, and it should be applied here
    const base_list = this.fromTargetTypeToList(type).filter(unit => unit.health > 0);
    if (!base_list.length) return [];
  
    switch (type) {
      case TargetType.AnySingle:
      case TargetType.EnemySingle:
      case TargetType.PlayerSingle:
        return Array(hit_count).fill(base_list[0]);
      case TargetType.AnyChain:
      case TargetType.EnemyChain:
      case TargetType.PlayerChain:
        return [...Array(hit_count)].map((v, i) => base_list[i % base_list.length]);
      case TargetType.AnyGroup:
      case TargetType.EnemyGroup:
      case TargetType.PlayerGroup:
        return [...Array(hit_count)].reduce(result => [...result, ...base_list], []);
    }
    
    throw new Error(`TargetType '${type}' with HitCount '${hit_count}' is not valid and could not be converted to BattleUnit[]`);
  }
  
  public fromTargetTypeToList(type: TargetType): Unit[] {
    switch (type) {
      case TargetType.AnySingle:
      case TargetType.AnyChain:
      case TargetType.AnyGroup:
        return this.unit_list;
      case TargetType.EnemySingle:
      case TargetType.EnemyChain:
      case TargetType.EnemyGroup:
        return this.unit_list.filter(unit => unit.alignment === UnitAlignmentType.ENEMY);
      case TargetType.PlayerSingle:
      case TargetType.PlayerChain:
      case TargetType.PlayerGroup:
        return this.unit_list.filter(unit => unit.alignment === UnitAlignmentType.PLAYER);
    }
    
    throw new Error(`Target type '${type}' is not valid and could not be converted to BattleUnit[]`);
  }
  
  private loop() {
    if (this.state !== EncounterStateType.IN_PROGRESS) return;
    
    this.tick_count++;
    this.time_updated = new Date();
    
    if (!this.unit_list.filter(unit => unit.alignment === UnitAlignmentType.ENEMY && unit.health > 0).length) {
      return this.end(true);
    }
    if (!this.unit_list.filter(unit => unit.alignment === UnitAlignmentType.PLAYER && unit.health > 0).length) {
      return this.end(false);
    }
    
    this.trigger(EncounterEventType.PROGRESS, {encounter: this});
    
    setTimeout(() => this.loop(), Encounter.tick_interval);
  }
  
  private setState(state: EncounterStateType) {
    this.state = state;
    this.trigger(EncounterEventType.STATE_CHANGE, {encounter: this, state});
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
  [EncounterEventType.STATE_CHANGE]: (event: EncounterStateChangeEvent) => void
}

export interface EncounterProgressEvent {
  encounter: Encounter;
}

export interface EncounterStateChangeEvent {
  encounter: Encounter;
  state: EncounterStateType;
}
