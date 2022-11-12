import ActionType from "../../../enums/ActionType";

export default abstract class LogInstance<C extends object = object> {

  public type: ActionType;
  public collection: Collection<C>;

  protected constructor(type: ActionType, initializer: LogInstanceInitializer<C>) {
    this.type = type;
    this.collection = initializer.collection ?? {};
  }

  public abstract addValue(...args: any[]): this;

  public abstract addInstance(instance: LogInstance): this;

  public static getUniqueKey(...args: any[]) {
    throw new Error(`${this.name} have not implemented getUniqueKey.`);
  }

}

interface Collection<O extends object = object> {
  [key: string]: O;
}

export interface LogInstanceInitializer<C extends object = object> {
  collection?: Collection<C>;
}
