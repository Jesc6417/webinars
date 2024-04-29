import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/app.module';
import { Fixture } from './fixtures/fixture';

export class AppTest {
  private app: INestApplication;

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

  async loadFixtures(fixtures: Fixture[]) {
    return Promise.all(fixtures.map((fixture) => fixture.load(this)));
  }
}
