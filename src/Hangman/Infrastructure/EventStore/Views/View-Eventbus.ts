// un-used at the moment (updaters are called in the event handlers)
// but keep files for now for possible future reference

import { EventBus } from '@nestjs/cqrs/dist/event-bus';
import { Injectable } from '@nestjs/common';
import { IEvent, IEventBus } from '@nestjs/cqrs/dist/interfaces';
import { ViewUpdater } from './View-Updater';

@Injectable()
export class ViewEventBus implements IEventBus {
  constructor(
    private readonly eventBus: EventBus,
    private viewUpdater: ViewUpdater,
  ) {}

  publish<T extends IEvent>(event: T): void {
    console.log('publish - eventbus');

    this.viewUpdater.run(event);
  }

  publishAll(events: IEvent[]): void {
    (events || []).forEach((event) => this.publish(event));
  }
}
