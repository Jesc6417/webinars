import { AuthenticationGuard } from './../guards';
import {
  ChangeSeats,
  OrganizeWebinar,
  User,
  WebinarAPI,
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
  ) {}

  @Post()
  async handleOrganizeWebinar(
    @Body(new ValidationPipe(WebinarAPI.OrganizeWebinar.schema))
    data: WebinarAPI.OrganizeWebinar.Request,
    @Request() request: { user: User },
  ): Promise<WebinarAPI.OrganizeWebinar.Response> {
    return this.organizeWebinar.execute({
      title: data.title,
      seats: data.seats,
      start: data.start,
      end: data.end,
      organizerId: request.user.props.id,
    });
  }

  @Post('/:id/change-seats')
  @HttpCode(200)
  async handleChangeSeats(
    @Param('id') webinarId: string,
    @Body(new ValidationPipe(WebinarAPI.ChangeSeats.schema))
    data: WebinarAPI.ChangeSeats.Request,
    @Request() request: { user: User },
  ): Promise<WebinarAPI.ChangeSeats.Response> {
    return this.changeSeats.execute({
      webinarId,
      seats: data.seats,
      organizerId: request.user.props.id,
    });
  }
}
