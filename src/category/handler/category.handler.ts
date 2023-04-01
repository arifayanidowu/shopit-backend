import { AppAbility } from 'src/casl/casl-ability.factory';
import { IPolicyHandler } from './../../casl/handler/policy.handler';
import { Action } from 'src/casl/enum/action.enum';
import { CategoryEntity as Category } from '../entity/category.entity';

export class CategoryHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Action.Manage, Category);
  }
}
