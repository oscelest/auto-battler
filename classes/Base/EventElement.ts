import Element, {ElementInitializer} from "./Element";

export default abstract class EventElement<Collection extends EventElementCollection> extends Element {

  private readonly callback_collection: { [K in keyof Collection]?: Function[] };

  protected constructor(initializer: EventElementInitializer) {
    super(initializer);
    this.callback_collection = {};
  }

  public on<Key extends keyof Collection>(event: Key, callback: (...data: Parameters<Collection[Key]>) => void) {
    this.getCallbackList(event).push(callback);
  }

  public off<Key extends keyof Collection>(event: Key, callback: (...data: Parameters<Collection[Key]>) => void) {
    const list = this.getCallbackList(event);
    for (let i = list.length; i >= 0; i--) {
      if (list[i] === callback) {
        list.splice(i, 1);
      }
    }
  }

  protected trigger<Key extends keyof Collection>(event: Key, ...data: Parameters<Collection[Key]>) {
    for (let callback of this.getCallbackList(event)) {
      callback(...data);
    }
  }

  private getCallbackList(event: keyof Collection): Function[] {
    return this.callback_collection[event] ?? (this.callback_collection[event] = []);
  }
}

export type EventElementCollection = {[key: string]: Fn}

export interface EventElementInitializer extends ElementInitializer {
  active?: boolean;
}
