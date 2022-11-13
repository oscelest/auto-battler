import TriggerEntity from "../../entities/Trigger/TriggerEntity";
import TriggerEventType from "../../enums/Encounter/Event/TriggerEventType";
import TriggerType from "../../enums/Encounter/TriggerType";
import {EntityEventElement} from "../Base";
import {EntityEventElementInitializer} from "../Base/EntityEventElement";
import {Effect} from "../Effect";
import {ExpirationTriggerInitializer} from "./ExpirationTrigger";
import {ExpirationStatusEffectTrigger, PeriodicStatusEffectTrigger} from "./index";
import {PeriodicStatusEffectTriggerInitializer} from "./PeriodicTrigger";

export default abstract class Trigger<Entity extends TriggerEntity = TriggerEntity, Event extends TriggerEvent = TriggerEvent> extends EntityEventElement<Entity, Event> {
  
  public effect: Effect;

  protected constructor(initializer: TriggerInitializer<Entity>) {
    super(initializer);
    this.effect = initializer.effect;
  }

  public static instantiate(initializer: TriggerInitializer) {
    switch (initializer.entity.type) {
      case TriggerType.PERIODIC:
        return new PeriodicStatusEffectTrigger(initializer as PeriodicStatusEffectTriggerInitializer);
      case TriggerType.EXPIRATION:
        return new ExpirationStatusEffectTrigger(initializer as ExpirationTriggerInitializer);
      case TriggerType.DAMAGE_TAKEN:
        return new ExpirationStatusEffectTrigger(initializer as ExpirationTriggerInitializer);
      case TriggerType.HEALING_RECEIVED:
        return new ExpirationStatusEffectTrigger(initializer as ExpirationTriggerInitializer);
    }
  }
}

export interface TriggerInitializer<Entity extends TriggerEntity = TriggerEntity> extends EntityEventElementInitializer<Entity> {
  effect: Effect;
}

export type TriggerEvent = {
  [TriggerEventType.FIRE]: (event: {trigger: Trigger}) => void
}
