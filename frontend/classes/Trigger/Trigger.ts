import {TriggerEventType} from "../../enums";
import {TriggerEntity} from "../../generated/contract/entities/Trigger/Trigger.entity";
import {TriggerType} from "../../generated/contract/enums/Discriminator/TriggerType";
import {EntityEventElement} from "../Base";
import {EntityEventElementInitializer} from "../Base/EntityEventElement";
import {Effect} from "../Effect";
import {DamageTakenTriggerInitializer} from "./DamageReceivedTrigger";
import {ExpirationTriggerInitializer} from "./ExpirationTrigger";
import {HealingReceivedTriggerInitializer} from "./HealingReceivedTrigger";
import {DamageTakenTrigger, ExpirationTrigger, HealingReceivedTrigger, PeriodicTrigger} from "./index";
import {PeriodicEffectTriggerInitializer} from "./PeriodicTrigger";

export default abstract class Trigger<Entity extends TriggerEntity = TriggerEntity, Event extends TriggerEvent = TriggerEvent> extends EntityEventElement<Entity, Event> {
  
  public effect: Effect;
  
  protected constructor(initializer: TriggerInitializer<Entity>) {
    super(initializer);
    this.effect = initializer.effect;
  }
  
  public static instantiate(initializer: TriggerInitializer) {
    switch (initializer.entity.type) {
      case TriggerType.PERIODIC:
        return new PeriodicTrigger(initializer as PeriodicEffectTriggerInitializer);
      case TriggerType.EXPIRATION:
        return new ExpirationTrigger(initializer as ExpirationTriggerInitializer);
      case TriggerType.DAMAGE_RECEIVED:
        return new DamageTakenTrigger(initializer as DamageTakenTriggerInitializer);
      case TriggerType.HEALING_RECEIVED:
        return new HealingReceivedTrigger(initializer as HealingReceivedTriggerInitializer);
    }
  }
}

export interface TriggerInitializer<Entity extends TriggerEntity = TriggerEntity> extends EntityEventElementInitializer<Entity> {
  effect: Effect;
}

export type TriggerEvent = {
  [TriggerEventType.FIRE]: (event: {trigger: Trigger}) => void
}
