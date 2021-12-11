import { IEvent, IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import {
  EventStoreDBClient,
  START,
  streamNameFilter,
} from '@eventstore/db-client';
import { EventStoreInstanciators } from '../../../event-store';

export class EventStoreEventSubscriber implements IMessageSource {
  private client: EventStoreDBClient;
  private bridge: Subject<any>;

  connect() {
    this.client = EventStoreDBClient.connectionString(
      'esdb://eventstore.db:2113?tls=false',
    );

    const reservationStreamPrefix = 'game';
    const filter = streamNameFilter({ prefixes: [reservationStreamPrefix] });

    const subscription = this.client.subscribeToAll({
      filter,
      fromPosition: START,
    });
    subscription.on('data', (data) => {
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
    console.log('bridged event to Subject', { subject });
  }
}
