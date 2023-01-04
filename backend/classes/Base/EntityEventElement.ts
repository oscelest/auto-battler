import EventElement, {EventElementCollection, EventElementInitializer} from "./EventElement";

export default abstract class EntityEventElement<Entity extends object, Collection extends EventElementCollection> extends EventElement<Collection> {
  
  public entity: Entity;
  
  protected constructor(initializer: EntityEventElementInitializer<Entity>) {
    super(initializer);
    this.entity = initializer.entity;
  }
}

export interface EntityEventElementInitializer<Entity extends object> extends EventElementInitializer {
  entity: Entity;
}
