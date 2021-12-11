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
    const _event = jsonEvent({
      type: 'SeatReserved',
      data: {
        reservationId: 'sfsd',
        movieId: 'sdfsdf',
        seatId: 'dsfdf',
        userId: 'sdfsdf',
      },
    });

    await this.client.appendToStream('game', _event);
    console.log('Event published to ....', { event });
  }
}
