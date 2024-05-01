import { DateProvider } from './../ports';

export class FixedDateProvider extends DateProvider {
  now() {
    return new Date('2024-04-28T10:00:00.000Z');
  }
}
