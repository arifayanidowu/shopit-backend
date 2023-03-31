import { ProductClass } from './../../casl/classes/schema.classes';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { IPolicyHandler } from './../../casl/handler/policy.handler';
import { Action } from 'src/casl/enum/action.enum';

export class ProductHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Manage, ProductClass);
  }
}

export class ProductDeleteHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.cannot(Action.Delete, ProductClass);
  }
}
