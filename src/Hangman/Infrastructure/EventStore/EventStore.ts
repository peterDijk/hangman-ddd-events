import { EventSourcingOptions } from './Interfaces';
import {
  AppendExpectedRevision,
  END,
  EventStoreDBClient,
  FORWARDS,
  jsonEvent,
  NO_STREAM,
  START,
  streamNameFilter,
} from '@eventstore/db-client';
import { IEvent } from '@nestjs/cqrs';
import { EventStoreInstanciators } from '../../../event-store';
import { Subject } from 'rxjs';
import { Repository } from 'typeorm';
import { Game as GameProjection } from '../../ReadModels/game.entity';
import { ViewEventBus } from './Views';

export class EventStore {
  private readonly eventstore: EventStoreDBClient;
  private readonly config;
  public eventStoreLaunched = false;
  private streamPrefix = '';

  constructor(options: EventSourcingOptions) {
    try {
      this.eventstore = EventStoreDBClient.connectionString(
        options.eventStoreUrl,
      );
      this.eventStoreLaunched = true;
    } catch (err) {
      this.eventStoreLaunched = false;
    }
  }

  public isInitiated(): boolean {
    return this.eventStoreLaunched;
  }

  // public getSnapshotInterval(aggregate: string): number | null {
  //   return this.config ? this.config[aggregate] : null;
  // }

  public async getEvents(
    aggregate: string,
    id: string,
  ): Promise<{
    events: IEvent[];
    snapshot?: any;
    lastRevision: AppendExpectedRevision;
  }> {
    return new Promise<{
      events: IEvent[];
      snapshot?: any;
      lastRevision: AppendExpectedRevision;
    }>(async (resolve) => {
      const events = [];
      let revision: AppendExpectedRevision = NO_STREAM;

      // find using own method
      const eventStream = await this.eventstore.readStream(
        this.getAggregateId(aggregate, id),
      );

      for await (const resolvedEvent of eventStream) {
        revision = resolvedEvent.event?.revision ?? revision;
        const parsedEvent = EventStoreInstanciators[resolvedEvent.event.type](
          resolvedEvent.event.data,
        );
        events.push(parsedEvent);
      }
      resolve({ events, lastRevision: revision });
    });
  }

  // public async getEvent(index: number): Promise<IEvent> {
  //   return new Promise<IEvent>((resolve, reject) => {
  //     this.getEvents(index, 1, (err, events) => {});
  //   });
  // }

  public async storeEvent<T extends IEvent>(event: T): Promise<void> {
    console.log('storeEvent');

    return new Promise<void>(async (resolve, reject) => {
      if (!this.eventStoreLaunched) {
        reject('Event Store not launched!');
        return;
      }
      const eventSerialized = JSON.stringify(event);
      const eventDeserialized = JSON.parse(eventSerialized);

      let revision: AppendExpectedRevision = NO_STREAM;

      try {
        const events = this.eventstore.readStream(
          this.getAggregateId(
            eventDeserialized.eventAggregate,
            eventDeserialized.id,
          ),
          {
            fromRevision: START,
            direction: FORWARDS,
          },
        );

        for await (const { event } of events) {
          revision = event?.revision ?? revision;
        }
      } catch (err) {}

      await this.eventstore.appendToStream(
        this.getAggregateId(
          eventDeserialized.eventAggregate,
          eventDeserialized.id,
        ),
        jsonEvent({
          id: eventDeserialized.id,
          type: eventDeserialized.eventName,
          data: {
            ...JSON.parse(eventSerialized),
          },
        }),
        { expectedRevision: revision },
      );
    });
  }

  setStreamPrefix(streamPrefix) {
    this.streamPrefix = streamPrefix;
  }

  async getAll(viewEventsBus: ViewEventBus) {
    const events = await this.eventstore.readAll();

    for await (const { event } of events) {
      const parsedEvent = EventStoreInstanciators[event.type]?.(event.data);

      if (parsedEvent) {
        viewEventsBus.publish(event);
      }
    }
  }

  subscribe(streamPrefix: string, bridge: Subject<any>) {
    const filter = streamNameFilter({ prefixes: [streamPrefix] });
    const subscription = this.eventstore.subscribeToAll({
      filter,
      fromPosition: END,
    });
    subscription.on('data', (data) => {
      console.log('from subscription');
      const parsedEvent = EventStoreInstanciators[data.event.type](
        data.event.data,
      );
      if (bridge) {
        console.log('next on bridge');
        bridge.next(parsedEvent);
      }
    });
  }

  // Monkey patch to obtain event 'instances' from db
  // private getStorableEventFromPayload(event: any): StorableEvent {
  //   const { payload } = event;
  //   const eventPlain = payload;
  //   eventPlain.constructor = {
  //     name: eventPlain.eventName,
  //   };

  //   const transformedEvent = Object.assign(
  //     Object.create(eventPlain),
  //     eventPlain,
  //   );
  //   transformedEvent.meta = {
  //     revision: event.streamRevision,
  //   };
  //   return transformedEvent;
  // }

  private getAggregateId(aggregate: string, id: string): string {
    return aggregate + '-' + id;
  }
}
