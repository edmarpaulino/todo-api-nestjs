import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export type AuthUser = {
  id: string
}

export const CurrentUser = createParamDecorator(
  (key: keyof AuthUser | undefined, context: ExecutionContext): AuthUser | string => {
    const request = context.switchToHttp().getRequest<Record<string, any>>()
    const user = request.user as AuthUser

    return key ? user[key] : user
  }
)
