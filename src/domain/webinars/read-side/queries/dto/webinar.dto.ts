export class WebinarDto {
  id: string;
  title: string;
  start: Date;
  end: Date;
  organizer: {
    id: string;
    email: string;
  };
  seats: {
    reserved: number;
    available: number;
  };
}
