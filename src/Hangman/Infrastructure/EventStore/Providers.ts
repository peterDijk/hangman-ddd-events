// import { ViewUpdater } from './view';
// import { ViewEventBus } from './view';
import { StoreEventBus } from './EventBus';
import { StoreEventPublisher } from './Publisher';

export function createEventSourcingProviders() {
  return [
    // ViewUpdater,
    // ViewEventBus,
    StoreEventBus,
    StoreEventPublisher,
  ];
}
