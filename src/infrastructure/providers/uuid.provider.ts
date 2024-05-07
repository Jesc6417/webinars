import { IdProvider } from '@/domain/core';
import { v4 } from 'uuid';

export class UuidProvider implements IdProvider {
  generate() {
    return v4();
  }
}
