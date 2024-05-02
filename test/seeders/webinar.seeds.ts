import { Webinar } from '@/domain/webinars';
import { addDays } from 'date-fns';
import { WebinarFixture } from '../fixtures/webinar.fixture';
import { e2eUsers } from './user.seeds';

const start = addDays(new Date(), 4);
const end = addDays(new Date(), 5);

export const e2eWebinars = {
  sampleWebinar: new WebinarFixture(
    new Webinar({
      id: 'id-1',
      title: 'Sample Webinar',
      start,
      end,
      seats: 100,
      organizer: e2eUsers.johnDoe.entity,
    }),
  ),
};
