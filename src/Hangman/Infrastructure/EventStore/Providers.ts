import { ViewUpdater } from './Views';
import { ViewEventBus } from './Views';
import { ModuleRef } from '@nestjs/core';
import { CommandBus, EventBus } from '@nestjs/cqrs';
import { StoreEventBus } from './EventBus';
import { EventStore } from './EventStore';
import { StoreEventPublisher } from './Publisher';
import { EventStoreEventSubscriber } from './Subscriber';

export function createEventSourcingProviders(streamPrefix?: string) {
  return [ViewUpdater, ViewEventBus, StoreEventBus, StoreEventPublisher];
}
