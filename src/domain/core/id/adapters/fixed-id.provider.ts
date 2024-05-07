import { IdProvider } from '../ports';

export class FixedIdProvider extends IdProvider {
  generate() {
    return 'id-1';
  }
}
