import { AuthenticationGuard } from '@/application/guards';
import { ReserveSeat, WebinarAPI } from '@/domain/webinars';
import { CancelSeat } from '@/domain/webinars/usecases/cancel-seat';
import {
  Controller,
  Delete,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';

@Controller('/participations')
@UseGuards(AuthenticationGuard)
export class ParticipationController {
  constructor(
    private readonly reserveSeat: ReserveSeat,
    private readonly cancelSeat: CancelSeat,
  ) {}

  @Post('/:id')
  async handleReserveSeat(
    @Param('id') webinarId: string,
    @Request() request: { userId: string },
  ): Promise<WebinarAPI.ReserveSeat.Response> {
    return this.reserveSeat.execute({
      webinarId,
      participantId: request.userId,
    });
  }

  @Delete('/:id')
  async handleCancelSeat(
    @Param('id') webinarId: string,
    @Request() request: { userId: string },
  ): Promise<WebinarAPI.ReserveSeat.Response> {
    return this.cancelSeat.execute({
      webinarId,
      participantId: request.userId,
    });
  }
}
