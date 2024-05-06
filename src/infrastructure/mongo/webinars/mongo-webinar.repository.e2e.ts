import { Webinar } from '@/domain/webinars';
import { MongoWebinar } from '@/infrastructure/mongo/webinars/mongo-webinar';
import { getModelToken } from '@nestjs/mongoose';
import { addDays } from 'date-fns';
import { Model } from 'mongoose';
import { AppTest } from '../../../../test/app-test';
import { MongoWebinarRepository } from './mongo-webinar.repository';

const start = addDays(new Date(), 5);
const end = addDays(new Date(), 6);
const tddWebinar = new Webinar({
  id: '1',
  organizerId: '1',
  title: 'TDD',
  seats: 10,
  start,
  end,
});

const cqrsWebinar = new Webinar({
  id: '2',
  organizerId: '1',
  title: 'CQRS',
  seats: 10,
  start,
  end,
});

describe('MongoWebinarRepository', () => {
  let repository: MongoWebinarRepository;
  let app: AppTest;
  let model: Model<MongoWebinar.SchemaClass>;

  const createWebinarInDatabase = async (webinar: Webinar) => {
    const record = new model({
      _id: webinar.props.id,
      organizerId: webinar.props.organizerId,
      title: webinar.props.title,
      seats: webinar.props.seats,
      start: webinar.props.start,
      end: webinar.props.end,
    });

    await record.save();
  };

  beforeEach(async () => {
    app = new AppTest();
    await app.setup();

    model = app.get(getModelToken(MongoWebinar.collection));

    repository = new MongoWebinarRepository(model);

    await createWebinarInDatabase(tddWebinar);
  });

  afterEach(async () => {
    await app.cleanup();
  });

  describe('Find webinar by id', () => {
    it('should return the webinar', async () => {
      const result = await repository.findById('1');

      expect(result!.props).toEqual(tddWebinar.props);
    });

    it('should return null', async () => {
      const result = await repository.findById('2');

      expect(result).toBeNull();
    });
  });

  describe('Create webinar', () => {
    it('should create the webinar', async () => {
      await repository.create(
        new Webinar({
          id: '2',
          organizerId: '1',
          title: 'Sample webinar',
          seats: 666,
          start,
          end,
        }),
      );

      const record = await model.findById('2');

      expect(record!.toObject()).toEqual({
        __v: 0,
        _id: '2',
        organizerId: '1',
        title: 'Sample webinar',
        seats: 666,
        start,
        end,
      });
    });
  });

  describe('Update webinar', () => {
    it('should update the webinar', async () => {
      await repository.create(cqrsWebinar);

      const cqrsCopy = cqrsWebinar.clone() as Webinar;
      cqrsCopy.update({ title: 'CQRS and Event Sourcing' });

      await repository.update(cqrsCopy);

      const record = await model.findById('2');

      expect(record!.toObject()).toEqual({
        __v: 0,
        _id: '2',
        organizerId: '1',
        title: 'CQRS and Event Sourcing',
        seats: 10,
        start,
        end,
      });
    });
  });

  describe('Cancel webinar', () => {
    it('should cancel the webinar', async () => {
      await repository.create(cqrsWebinar);

      await repository.cancel('2');

      const record = await model.findById('2');

      expect(record).toBeNull();
    });
  });
});
