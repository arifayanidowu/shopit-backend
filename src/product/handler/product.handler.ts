import { AppAbility } from 'src/casl/casl-ability.factory';
import { IPolicyHandler } from './../../casl/handler/policy.handler';
import { Action } from 'src/casl/enum/action.enum';
import { ProductEntity as Product } from '../entity/product.entity';
export class ProductHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Manage, Product);
  }
}

export class ProductCannotDeleteHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Delete, Product, 'draft');
  }
}
