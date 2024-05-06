import { MongoParticipation } from '@/infrastructure/mongo/participations/mongo-participation';
import { MongoUser } from '@/infrastructure/mongo/users/mongo-user';
import { MongoWebinar } from '@/infrastructure/mongo/webinars/mongo-webinar';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../src/client/app.module';
import { Fixture } from './fixtures/fixture';

export class AppTest {
  private app: INestApplication;

  async setup() {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule,
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          ignoreEnvVars: true,
          load: [
            () => ({
              MONGODB_URI:
                'mongodb://admin:azerty@localhost:3701/webinars?authSource=admin&directConnection=true',
            }),
          ],
        }),
      ],
    }).compile();

    this.app = moduleFixture.createNestApplication();
    await this.app.init();

    await this.clearDatabase();
  }

  async cleanup() {
    await this.app.close();
  }

  get<T>(service: any): T {
    return this.app.get(service);
  }

  getHttpServer() {
    return this.app.getHttpServer();
  }

  async loadFixtures(fixtures: Fixture[]) {
    return Promise.all(fixtures.map((fixture) => fixture.load(this)));
  }

  private async clearDatabase() {
    await this.app.get(getModelToken(MongoUser.collection)).deleteMany({});
    await this.app.get(getModelToken(MongoWebinar.collection)).deleteMany({});
    await this.app
      .get(getModelToken(MongoParticipation.collection))
      .deleteMany({});
  }
}
