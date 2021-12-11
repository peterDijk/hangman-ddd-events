// import { ViewUpdater } from './view';
// import { ViewEventBus } from './view';
import { StoreEventBus } from './EventBus';
import { StoreEventPublisher } from './Publisher';
import { EventStoreEventSubscriber } from './Subscriber';

export function createEventSourcingProviders() {
  return [
    // ViewUpdater,
    // ViewEventBus,
    StoreEventBus,
    StoreEventPublisher,
  ];
}
