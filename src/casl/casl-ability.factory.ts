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
import {
  AdminClass,
  ProductClass,
  BrandClass,
  CategoryClass,
} from './classes/schema.classes';

type Subjects =
  | InferSubjects<
      | Admin
      | Promotion
      | typeof ProductClass
      | typeof BrandClass
      | typeof AdminClass
      | typeof CategoryClass
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
    } else {
      can(Action.Read, 'all'); // read-only access to everything
    }

    can(Action.Delete, AdminClass, ({ role }) => role.includes('SuperAdmin'));
    can(Action.Delete, ProductClass, ({ status }) => status === 'draft');

    return build({
      // Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
      detectSubjectType: (item) =>
        item.constructor as unknown as ExtractSubjectType<Subjects>,
      conditionsMatcher: lambdaMatcher,
    });
  }
}
