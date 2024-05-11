import {
  CancelWebinarCommand,
  ChangeDatesCommand,
  ChangeDatesCommandHandler,
  ChangeSeatsCommand,
  ChangeSeatsCommandHandler,
  OrganizeWebinarCommand,
  WebinarAPI,
  WebinarByIdQueryStore,
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
import { CommandBus } from '@nestjs/cqrs';
import { AuthenticationGuard } from './../guards';
import { ValidationPipe } from './../pipes/validation.pipe';

@Controller('/webinars')
@UseGuards(AuthenticationGuard)
export class WebinarCommandController {
  constructor(
    private readonly webinarByIdQueryStore: WebinarByIdQueryStore,
    private readonly commandBus: CommandBus,
  ) {}

  @Post()
  async handleOrganizeWebinar(
    @Body(new ValidationPipe(WebinarAPI.OrganizeWebinar.schema))
    data: WebinarAPI.OrganizeWebinar.Request,
    @Request() request: { userId: string },
  ): Promise<WebinarAPI.OrganizeWebinar.Response> {
    const result = await this.commandBus.execute(
      new OrganizeWebinarCommand(
        data.title,
        data.seats,
        data.start,
        data.end,
        request.userId,
      ),
    );

    await this.webinarByIdQueryStore.store(result.id);

    return result;
  }

  @Post('/:id/change-seats')
  @HttpCode(200)
  async handleChangeSeats(
    @Param('id') webinarId: string,
    @Body(new ValidationPipe(WebinarAPI.ChangeSeats.schema))
    data: WebinarAPI.ChangeSeats.Request,
    @Request() request: { userId: string },
  ): Promise<WebinarAPI.ChangeSeats.Response> {
    return this.commandBus.execute(
      new ChangeSeatsCommand(webinarId, data.seats, request.userId),
    );
  }

  @Post('/:id/change-dates')
  @HttpCode(200)
  async handleChangeDates(
    @Param('id') webinarId: string,
    @Body(new ValidationPipe(WebinarAPI.ChangeDates.schema))
    data: WebinarAPI.ChangeDates.Request,
    @Request() request: { userId: string },
  ): Promise<WebinarAPI.ChangeDates.Response> {
    return this.commandBus.execute(
      new ChangeDatesCommand(webinarId, request.userId, data.start, data.end),
    );
  }

  @Delete('/:id')
  async handleCancelWebinar(
    @Param('id') webinarId: string,
    @Request() request: { userId: string },
  ): Promise<WebinarAPI.CancelWebinar.Response> {
    return this.commandBus.execute(
      new CancelWebinarCommand(webinarId, request.userId),
    );
  }
}
