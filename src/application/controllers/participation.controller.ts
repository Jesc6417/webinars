import { AuthenticationGuard } from '@/application/guards';
import {
  CancelSeatCommand,
  ReserveSeatCommand,
  WebinarAPI,
} from '@/domain/webinars';
import {
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@Controller('/participations')
@UseGuards(AuthenticationGuard)
export class ParticipationController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('/:id')
  async handleReserveSeat(
    @Param('id') webinarId: string,
    @Request() request: { userId: string },
  ): Promise<WebinarAPI.ReserveSeat.Response> {
    return this.commandBus.execute(
      new ReserveSeatCommand(webinarId, request.userId),
    );
  }

  @Delete('/:id')
  async handleCancelSeat(
    @Param('id') webinarId: string,
    @Request() request: { userId: string },
  ): Promise<WebinarAPI.ReserveSeat.Response> {
    return this.commandBus.execute(
      new CancelSeatCommand(webinarId, request.userId),
    );
  }
}
