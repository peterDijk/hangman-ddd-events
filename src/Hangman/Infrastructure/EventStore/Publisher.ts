import { IEvent, IEventPublisher } from '@nestjs/cqrs';
import {
  AppendExpectedRevision,
  EventStoreDBClient,
  FORWARDS,
  jsonEvent,
  NO_STREAM,
  START,
} from '@eventstore/db-client';
export class EventStoreEventPublisher implements IEventPublisher {
  private client: EventStoreDBClient;

  connect() {
    this.client = EventStoreDBClient.connectionString(
      'esdb://eventstore.db:2113?tls=false',
    );
  }

  async publish<T extends IEvent = IEvent>(event: T) {
    const eventSerialized = JSON.stringify(event);
    const eventDeserialized = JSON.parse(eventSerialized);

    const events = this.client.readStream(`game-${eventDeserialized.id}`, {
      fromRevision: START,
      direction: FORWARDS,
    });

    let revision: AppendExpectedRevision = NO_STREAM;
    for await (const { event } of events) {
      revision = event?.revision ?? revision;
    }

    await this.client.appendToStream(
      `game-${eventDeserialized.id}`,
      jsonEvent({
        id: eventDeserialized.id,
        type: eventDeserialized.eventName,
        data: {
          ...JSON.parse(eventSerialized),
        },
      }),
      { expectedRevision: revision },
    );
    console.log('Event published to ....', { eventDeserialized });
  }
}
