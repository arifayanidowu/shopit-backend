import { ProductClass } from './../../casl/classes/schema.classes';
import { AppAbility } from 'src/casl/casl-ability.factory';
import { IPolicyHandler } from './../../casl/handler/policy.handler';
import { Action } from 'src/casl/enum/action.enum';

export class GetProductsHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Read, ProductClass);
  }
}
