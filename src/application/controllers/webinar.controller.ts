import { AuthenticationGuard } from './../guards';
import {
  ChangeSeats,
  OrganizeWebinar,
  Organizer,
  WebinarAPI,
  ChangeDates,
} from '@/domain/webinars';
import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Param,
  HttpCode,
} from '@nestjs/common';
import { ValidationPipe } from './../pipes/validation.pipe';

@Controller('/webinars')
@UseGuards(AuthenticationGuard)
export class WebinarController {
  constructor(
    private readonly organizeWebinar: OrganizeWebinar,
    private readonly changeSeats: ChangeSeats,
    private readonly changeDates: ChangeDates,
  ) {}

  @Post()
  async handleOrganizeWebinar(
    @Body(new ValidationPipe(WebinarAPI.OrganizeWebinar.schema))
    data: WebinarAPI.OrganizeWebinar.Request,
    @Request() request: { organizerId: string },
  ): Promise<WebinarAPI.OrganizeWebinar.Response> {
    return this.organizeWebinar.execute({
      title: data.title,
      seats: data.seats,
      start: data.start,
      end: data.end,
      organizer: new Organizer({ id: request.organizerId }),
    });
  }

  @Post('/:id/change-seats')
  @HttpCode(200)
  async handleChangeSeats(
    @Param('id') webinarId: string,
    @Body(new ValidationPipe(WebinarAPI.ChangeSeats.schema))
    data: WebinarAPI.ChangeSeats.Request,
    @Request() request: { organizerId: string },
  ): Promise<WebinarAPI.ChangeSeats.Response> {
    return this.changeSeats.execute({
      webinarId,
      seats: data.seats,
      organizer: new Organizer({ id: request.organizerId }),
    });
  }

  @Post('/:id/change-dates')
  @HttpCode(200)
  async handleChangeDates(
    @Param('id') webinarId: string,
    @Body(new ValidationPipe(WebinarAPI.ChangeDates.schema))
    data: WebinarAPI.ChangeDates.Request,
    @Request() request: { organizerId: string },
  ): Promise<WebinarAPI.ChangeDates.Response> {
    return this.changeDates.execute({
      start: data.start,
      end: data.end,
      webinarId,
      organizerId: request.organizerId,
    });
  }
}
