// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventListener = (...args: any[]) => void;

export default class EventEmitter {
  private static instance: EventEmitter;

  private events: Record<string, EventListener[]> = {};

  static getInstance() {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  // Method to subscribe to an event(Способ подписки на событие)
  on(eventName: string, callback: EventListener) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }
    this.events[eventName].push(callback);
  }

  // Method to emit an event(Метод генерации события)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(eventName: string, ...args: any[]) {
    const eventCallbacks = this.events[eventName] || [];
    eventCallbacks.forEach((callback) => callback(...args));
  }
}
