import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/client/app.module';
import { Fixture } from './fixtures/fixture';

export class AppTest<T> {
  private app: INestApplication;
  readonly path: string;

  constructor(TCtor: new (...args: any[]) => T) {
    this.path = `/${TCtor.name.toLowerCase()}s`;
  }

  async setup() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    await this.app.init();
  }

  async cleanup() {
    await this.app.close();
  }

  get<t>(service: any): t {
    return this.app.get(service);
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }

  async loadFixtures(fixtures: Fixture<T>[]) {
    return Promise.all(fixtures.map((fixture) => fixture.load(this)));
  }
}
