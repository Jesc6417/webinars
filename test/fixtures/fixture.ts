import { AppTest } from '../app-test';

export abstract class Fixture<T> {
  abstract load(app: AppTest<T>): Promise<void>;
}
