import { Script } from './';
import { INestApplication } from '@nestjs/common';
import { ReconstructViewDb } from '@berniemac/event-sourcing-nestjs';
// Delete?
Script.run(async (app: INestApplication) => {
  await ReconstructViewDb.run(app);
});
