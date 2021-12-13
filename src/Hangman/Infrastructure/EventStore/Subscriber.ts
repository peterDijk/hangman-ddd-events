import { IEvent, IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import {
  EventStoreDBClient,
  START,
  streamNameFilter,
} from '@eventstore/db-client';
import { EventStoreInstanciators } from '../../../event-store';
import { Injectable, Logger } from '@nestjs/common';
import { EventStore } from './EventStore';

export class EventStoreEventSubscriber implements IMessageSource {
  private client: EventStoreDBClient;
  private bridge: Subject<any>;
  public isConnected = false;
  public hasBridge = false;

  private logger = new Logger(EventStoreEventSubscriber.name);

  constructor(private readonly eventStore: EventStore) {}

  subscribe(streamPrefix) {
    this.logger.log('subscribe');
    if (this.bridge) {
      this.eventStore.subscribe(streamPrefix, this.bridge);
    }
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {
    this.bridge = subject;
  }
}
