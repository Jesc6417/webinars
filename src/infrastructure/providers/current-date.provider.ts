import { DateProvider } from '@/domain/core';

export class CurrentDateProvider extends DateProvider {
  now() {
    return new Date();
  }
}
