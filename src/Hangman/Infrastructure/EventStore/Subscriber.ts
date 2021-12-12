import { IEvent, IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import {
  EventStoreDBClient,
  START,
  streamNameFilter,
} from '@eventstore/db-client';
import { EventStoreInstanciators } from '../../../event-store';
import { Injectable } from '@nestjs/common';
import { EventStore } from './EventStore';

Injectable();
export class EventStoreEventSubscriber implements IMessageSource {
  private client: EventStoreDBClient;
  private bridge: Subject<any>;
  public isConnected = false;
  // constructor(eventStore: EventStore) {}

  connect() {
    this.client = EventStoreDBClient.connectionString(
      'esdb://eventstore.db:2113?tls=false',
    );

    this.isConnected = true;

    const streamPrefix = 'game';
    const filter = streamNameFilter({ prefixes: [streamPrefix] });

    const subscription = this.client.subscribeToAll({
      filter,
      fromPosition: START,
    });
    subscription.on('data', (data) => {
      console.log('from subscription');
      const parsedEvent = EventStoreInstanciators[data.event.type](
        data.event.data,
      );
      if (this.bridge) {
        this.bridge.next(parsedEvent);
      }
    });
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {
    this.bridge = subject;
  }
}
