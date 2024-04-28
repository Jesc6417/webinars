import { DateGenerator } from '@/domain/core';

export class CurrentDateGenerator extends DateGenerator {
  now() {
    return new Date();
  }
}
