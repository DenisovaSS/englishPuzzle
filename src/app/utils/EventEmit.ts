// eslint-disable-next-line @typescript-eslint/no-explicit-any
type EventListener = (...args: any[]) => void;

// export default class EventEmitter {
//   private static instance: EventEmitter;

//   private events: Record<string, EventListener[]> = {};

//   static getInstance() {
//     if (!EventEmitter.instance) {
//       EventEmitter.instance = new EventEmitter();
//     }
//     return EventEmitter.instance;
//   }

//   // Method to subscribe to an event(Способ подписки на событие)
//   on(eventName: string, callback: EventListener) {
//     if (!this.events[eventName]) {
//       this.events[eventName] = [];
//     }
//     this.events[eventName].push(callback);
//   }

//   // для удаления “подписки” на событие
//   unsubscribe(eventName: string, callback: EventListener) {
//     if (this.events[eventName]) {
//       this.events[eventName] = this.events[eventName].filter(
//         (eventCallback) => callback !== eventCallback,
//       );
//     }
//   }

//   // Method to emit an event(Метод генерации события)
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   emit(eventName: string, ...args: any[]) {
//     const eventCallbacks = this.events[eventName] || [];
//     eventCallbacks.forEach((callback) => callback(...args));
//   }

//   clearAllListeners() {
//     this.events = {};
//   }

//   getEventNames(): string[] {
//     return Object.keys(this.events);
//   }

//   removeAllListeners(eventName?: string) {
//     if (eventName) {
//       delete this.events[eventName];
//     } else {
//       this.events = {};
//     }
//   }
// }

export default class EventEmitter {
  private static instance: EventEmitter;

  private listeners: Record<string, EventListener[]> = {};

  static getInstance() {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  // Method to subscribe to an event(Способ подписки на событие)
  on(eventName: string, callback: EventListener) {
    const subs = this.listeners[eventName] ?? [];
    subs.push(callback);
    if (subs.length === 0) {
      delete this.listeners[eventName];
    } else { this.listeners[eventName] = subs; }
    return () => this.unsubscribe(eventName, callback);
  }

  // для удаления “подписки” на событие
  unsubscribe(eventName: string, callback: EventListener) {
    if (this.listeners[eventName]) {
      this.listeners[eventName] = this.listeners[eventName].filter(
        (eventCallback) => callback !== eventCallback,
      );
    }
  }

  // Method to emit an event(Метод генерации события)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  emit(eventName: string, ...args: any[]) {
    const eventCallbacks = this.listeners[eventName] || [];
    eventCallbacks.forEach((callback) => callback(...args));
  }

  clearAllListeners() {
    this.listeners = {};
  }

  getEventNames(): string[] {
    return Object.keys(this.listeners);
  }

  getAllListeners(): Record<string, EventListener[]> {
    return this.listeners;
  }
}
