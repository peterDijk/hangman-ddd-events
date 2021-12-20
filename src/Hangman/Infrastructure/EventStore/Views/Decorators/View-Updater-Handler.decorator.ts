import { ViewUpdaters } from '../View-Updaters';
import { IEvent } from '@nestjs/cqrs';
import { Type } from '@nestjs/common';

export function ViewUpdaterHandler(event: Type<IEvent>) {
  return (target: any) => {
    ViewUpdaters.add(event.name, target);
  };
}
