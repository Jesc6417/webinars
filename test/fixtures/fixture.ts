import { AppTest } from '../app-test';

export abstract class Fixture {
  abstract load(app: AppTest): Promise<void>;
}
