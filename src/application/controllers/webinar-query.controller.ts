import { GetWebinarByIdQuery } from '@/domain/webinars';
import { Controller, Get, Param } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';

@Controller('/webinars')
export class WebinarQueryController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get('/:id')
  async handleGetWebinarById(@Param('id') webinarId: string) {
    return this.queryBus.execute(new GetWebinarByIdQuery(webinarId));
  }
}
