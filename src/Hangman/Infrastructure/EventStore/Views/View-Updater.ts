import { Injectable, Type } from '@nestjs/common';
import { IViewUpdater } from './Interfaces/View-Updater';
import { IEvent } from '@nestjs/cqrs';
import { ModuleRef } from '@nestjs/core';
import { ViewUpdaters } from './View-Updaters';

@Injectable()
export class ViewUpdater {
  private instances = new Map<
    Type<IViewUpdater<IEvent>>,
    IViewUpdater<IEvent>
  >();

  constructor(private moduleRef: ModuleRef) {}

  async run<T extends IEvent>(event: T): Promise<void> {
    console.log('running viewupdater', {
      'event.constructor.name': event.constructor.name,
      event,
    });
    const updater = ViewUpdaters.get(event.constructor.name);
    console.log({ updater });
    if (updater) {
      if (!this.instances.has(updater)) {
        this.instances.set(
          updater,
          this.moduleRef.get(updater.name, { strict: false }),
        );
      }
      await this.instances.get(updater).handle(event);
    }
    return;
  }
}
