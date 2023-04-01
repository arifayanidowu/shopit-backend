import { Injectable } from '@nestjs/common';
import {
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
  InferSubjects,
  MatchConditions,
  PureAbility,
} from '@casl/ability';
import { Action } from '../casl/enum/action.enum';
import { Admin, Promotion } from '@prisma/client';
import { AdminClass } from './classes/schema.classes';
import { ProductEntity as Product } from 'src/product/entity/product.entity';
import { CategoryEntity as Category } from 'src/category/entity/category.entity';
import { BrandEntity as Brand } from 'src/brand/entity/brand.entity';

type Subjects =
  | InferSubjects<
      | Admin
      | Promotion
      | typeof Product
      | typeof Brand
      | typeof AdminClass
      | typeof Category
    >
  | 'all';
export type AppAbility = PureAbility<[Action, Subjects], MatchConditions>;
const lambdaMatcher = (matchConditions: MatchConditions) => matchConditions;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: Admin) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      PureAbility as AbilityClass<AppAbility>,
    );
    if (
      user.isAdmin &&
      (user.role === 'SuperAdmin' || user.role === 'Editor')
    ) {
      can(Action.Manage, 'all'); // read-write access to everything
      can(Action.Delete, Product, ({ status }) => ['draft'].includes(status));
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }
    can(Action.Delete, AdminClass, ({ role }) => role.includes('SuperAdmin'));
    cannot(Action.Delete, Product, ({ status }) =>
      ['published', 'archived'].includes(status),
    );
    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<Subjects>,
      conditionsMatcher: lambdaMatcher,
    });
  }
}
