import { applyDecorators, UseGuards } from '@nestjs/common';
import { CheckPolicies } from 'src/casl/decorator/check-policies.decorator';
import { PoliciesGuard } from 'src/casl/guard/policies.guard';
import { PolicyHandler } from 'src/casl/handler/policy.handler';
import { JwtAuthGuard } from './jwt-auth.guard';

export function Auth(...handlers: PolicyHandler[]) {
  return applyDecorators(
    UseGuards(JwtAuthGuard, PoliciesGuard),
    CheckPolicies(...handlers),
  );
}
