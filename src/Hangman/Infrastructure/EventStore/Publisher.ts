import { Injectable } from '@nestjs/common';
import { StoreEventBus } from './EventBus';
import { IEvent, AggregateRoot, IEventPublisher } from '@nestjs/cqrs';

export interface Constructor<T> {
  new (...args: any[]): T;
}

@Injectable()
export class StoreEventPublisher {
  constructor(private readonly eventBus: StoreEventBus) {
    console.log('constructor StoreEventPublisher');
  }

  mergeClassContext<T extends Constructor<AggregateRoot>>(metatype: T): T {
    const eventBus = this.eventBus;
    return class extends metatype {
      publish(event: IEvent) {
        eventBus.publish(event);
      }
    };
  }

  mergeObjectContext<T extends AggregateRoot>(object: T): T {
    const eventBus = this.eventBus;
    object.publish = (event: IEvent) => {
      eventBus.publish(event);
    };
    return object;
  }
  // async publish<T extends IEvent = IEvent>(event: T) {
  //   this.eventBus.publish(event);
  // }

  // async publishAll<T extends IEvent = IEvent>(events: T[]) {
  //   this.eventBus.publishAll(events);
  // }
}
