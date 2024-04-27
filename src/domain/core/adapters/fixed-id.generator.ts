import { IdGenerator } from '../ports/id.generator';

export class FixedIdGenerator extends IdGenerator {
  generate() {
    return 'id-1';
  }
}
