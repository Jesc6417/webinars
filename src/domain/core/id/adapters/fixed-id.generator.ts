import { IdGenerator } from '../ports';

export class FixedIdGenerator extends IdGenerator {
  generate() {
    return 'id-1';
  }
}
