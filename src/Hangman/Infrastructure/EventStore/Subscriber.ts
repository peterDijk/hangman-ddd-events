import { IEvent, IMessageSource } from '@nestjs/cqrs';
import { Subject } from 'rxjs';
import { EventStoreDBClient, streamNameFilter } from '@eventstore/db-client';

export class EventStoreEventSubscriber implements IMessageSource {
  private client: EventStoreDBClient;

  connect() {
    this.client = EventStoreDBClient.connectionString(
      'esdb://eventstore.db:2113?tls=false',
    );

    const reservationStreamPrefix = 'game';
    const filter = streamNameFilter({ prefixes: [reservationStreamPrefix] });

    const subscription = this.client.subscribeToAll({ filter });
    subscription.on('data', (data) => {
      console.log({ data });
    });
  }
  bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {
    console.log('bridged event to thingy', { subject });
  }
}
