import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';

@Injectable()
export class ValidationPipe implements PipeTransform {
  constructor(private schema: z.Schema<any>) {}

  transform(payload: any): any {
    const result = this.schema.safeParse(payload);

    if (result.success) return result.data;

    throw new BadRequestException('Failed to validate');
  }
}
