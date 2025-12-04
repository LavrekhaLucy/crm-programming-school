import { PickType } from '@nestjs/swagger';

import { BaseUserReqDto } from './user-base.req.dto';

export class UpdateUserReqDto extends PickType(BaseUserReqDto, ['name']) {}
