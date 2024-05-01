import { IdGenerator } from '@/domain/core';
import { v4 } from 'uuid';

export class UuidProvider extends IdGenerator {
  generate() {
    return v4();
  }
}
