import { AuthenticationGuard } from './../guards';
import { OrganizeWebinar, User, WebinarAPI } from '@/domain/webinars';
import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { ValidationPipe } from './../pipes/validation.pipe';

@Controller('/webinars')
@UseGuards(AuthenticationGuard)
export class WebinarController {
  constructor(private readonly organizeWebinar: OrganizeWebinar) {}

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
}
