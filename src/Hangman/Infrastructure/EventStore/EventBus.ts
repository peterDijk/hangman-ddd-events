import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus as NestJsEventBus } from '@nestjs/cqrs';
import { EventStoreEventPublisher } from './Publisher';
import { EventStoreEventSubscriber } from './Subscriber';

@Injectable()
export class EventBus extends NestJsEventBus implements OnModuleInit {
  constructor(commandBus: CommandBus, moduleRef: ModuleRef) {
    super(commandBus, moduleRef);
  }

  onModuleInit() {
    const subscriber = new EventStoreEventSubscriber();
    subscriber.bridgeEventsTo(this._subject$);
    this.publisher = new EventStoreEventPublisher();
  }
}
