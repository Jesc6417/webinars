import { IdGenerator } from '@/domain/core';
import { v4 } from 'uuid';

export class UuidGenerator extends IdGenerator {
  generate() {
    return v4();
  }
}
