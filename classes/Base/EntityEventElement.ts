import {EventElementCollection, EventElementInitializer} from "./EventElement";
import {EventElement} from "./index";

export default abstract class EntityEventElement<Entity extends ClassInstance, Collection extends EventElementCollection> extends EventElement<Collection> {

  public entity: Entity;

  protected constructor(initializer: EntityEventElementInitializer<Entity>) {
    super(initializer);
    this.entity = initializer.entity;
  }
}

export interface EntityEventElementInitializer<Entity extends ClassInstance> extends EventElementInitializer {
  entity: Entity;
}
