import {
  CancelWebinar,
  ChangeDates,
  ChangeSeats,
  OrganizeWebinar,
  WebinarAPI,
} from '@/domain/webinars';
import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthenticationGuard } from './../guards';
import { ValidationPipe } from './../pipes/validation.pipe';

@Controller('/webinars')
@UseGuards(AuthenticationGuard)
export class WebinarController {
  constructor(
    private readonly organizeWebinar: OrganizeWebinar,
    private readonly changeSeats: ChangeSeats,
    private readonly changeDates: ChangeDates,
    private readonly cancelWebinar: CancelWebinar,
  ) {}

  @Post()
  async handleOrganizeWebinar(
    @Body(new ValidationPipe(WebinarAPI.OrganizeWebinar.schema))
    data: WebinarAPI.OrganizeWebinar.Request,
    @Request() request: { userId: string },
  ): Promise<WebinarAPI.OrganizeWebinar.Response> {
    return this.organizeWebinar.execute({
      title: data.title,
      seats: data.seats,
      start: data.start,
      end: data.end,
      organizerId: request.userId,
    });
  }

  @Post('/:id/change-seats')
  @HttpCode(200)
  async handleChangeSeats(
    @Param('id') webinarId: string,
    @Body(new ValidationPipe(WebinarAPI.ChangeSeats.schema))
    data: WebinarAPI.ChangeSeats.Request,
    @Request() request: { userId: string },
  ): Promise<WebinarAPI.ChangeSeats.Response> {
    return this.changeSeats.execute({
      webinarId,
      seats: data.seats,
      organizerId: request.userId,
    });
  }

  @Post('/:id/change-dates')
  @HttpCode(200)
  async handleChangeDates(
    @Param('id') webinarId: string,
    @Body(new ValidationPipe(WebinarAPI.ChangeDates.schema))
    data: WebinarAPI.ChangeDates.Request,
    @Request() request: { userId: string },
  ): Promise<WebinarAPI.ChangeDates.Response> {
    return this.changeDates.execute({
      start: data.start,
      end: data.end,
      webinarId,
      organizerId: request.userId,
    });
  }

  @Delete('/:id')
  async handleCancelWebinar(
    @Param('id') webinarId: string,
    @Request() request: { userId: string },
  ): Promise<WebinarAPI.CancelWebinar.Response> {
    return this.cancelWebinar.execute({
      webinarId,
      organizerId: request.userId,
    });
  }
}
