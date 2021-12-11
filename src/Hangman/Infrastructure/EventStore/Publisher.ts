import { IEvent, IEventPublisher } from '@nestjs/cqrs';
import { EventStoreDBClient, jsonEvent } from '@eventstore/db-client';
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

    await this.client.appendToStream(
      `game-${eventDeserialized.id}`,
      jsonEvent({
        id: eventDeserialized.id,
        type: eventDeserialized.eventName,
        data: {
          ...JSON.parse(eventSerialized),
        },
      }),
    );
    console.log('Event published to ....', { eventDeserialized });
  }
}
