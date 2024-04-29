import { DateGenerator } from './../ports';

export class FixedDateGenerator extends DateGenerator {
  now() {
    return new Date('2024-04-28T10:00:00.000Z');
  }
}
