import { IdGenerator } from '@/domain/core';
import { v4 } from 'uuid';

export class UuidProvider implements IdGenerator {
  generate() {
    return v4();
  }
}
