import { OrganizeWebinar } from '@/domain/webinars';
import { Body, Controller, Post } from '@nestjs/common';

@Controller('/webinars')
export class WebinarController {
  constructor(private readonly organizeWebinar: OrganizeWebinar) {}

  @Post()
  async handleOrganizeWebinar(@Body() data: any) {
    return this.organizeWebinar.execute(data);
  }
}
