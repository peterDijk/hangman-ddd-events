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
import { InjectRepository } from '@nestjs/typeorm';
import { Game as GameProjection } from '../../ReadModels/game.entity';
import { Repository } from 'typeorm';
import { ViewEventBus } from './Views';

export class EventStoreEventSubscriber implements IMessageSource {
  private client: EventStoreDBClient;
  private bridge: Subject<any>;
  public isConnected = false;
  public hasBridge = false;
  public stream = '';

  private logger = new Logger(EventStoreEventSubscriber.name);

  constructor(
    private readonly eventStore: EventStore,
    private readonly viewEventsBus: ViewEventBus,
  ) {}

  setStreamPrefix(prefix: string) {
    this.stream = prefix;
  }

  getAll() {
    this.eventStore.getAll(this.viewEventsBus);
  }

  subscribe(streamPrefix) {
    if (this.bridge) {
      this.eventStore.subscribe(streamPrefix, this.bridge);
    }
  }

  bridgeEventsTo<T extends IEvent>(subject: Subject<T>) {
    this.bridge = subject;
  }
}
