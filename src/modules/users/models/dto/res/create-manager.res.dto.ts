import { PickType } from '@nestjs/swagger';
import { CreateManagerDto } from '../req/create-manager.req.dto';

export class CreateManagerResDto extends PickType(CreateManagerDto, [
  'email',

  'password',

  'username',

  'name',

  'surname',
]) {}
