// import { ViewUpdater } from './view';
// import { ViewEventBus } from './view';
import { StoreEventBus } from './EventBus';
import { EventStore } from './EventStore';
import { EventStoreEventPublisher } from './Publisher';
import { EventStoreEventSubscriber } from './Subscriber';

export function createEventSourcingProviders() {
  return [
    // ViewUpdater,
    // ViewEventBus,
    StoreEventBus,
    EventStoreEventPublisher,
    // EventStore,
  ];
}
