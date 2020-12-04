export interface EventStoreMessage {
  streamId: string;
  eventId: string;
  eventNumber: number;
  eventType: string;
  created: Date;
  metadata: Record<string, unknown>;
  isJson: boolean;
  data: Record<string, unknown>;
}
