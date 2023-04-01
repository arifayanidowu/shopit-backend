// import { BrandClass } from './../../casl/classes/schema.classes';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { IPolicyHandler } from './../../casl/handler/policy.handler';
import { Action } from 'src/casl/enum/action.enum';
import { BrandEntity as Brand } from '../entity/brand.entity';

export class CreateBrandHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Manage, Brand);
  }
}
