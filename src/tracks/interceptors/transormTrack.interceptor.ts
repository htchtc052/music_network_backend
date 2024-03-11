import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { classToPlain } from 'class-transformer';
import { SerializerInterceptor } from '../../commons/serializerInterceptor';
import { RequestWithTrack } from '../types/requestWithTrack.type';
import { Track } from '@prisma/client';
import { subject } from '@casl/ability';
import { AbilityFactory, Action, AppAbility } from '../../casl/ability.factory';

export interface Response<T> {
  data: T;
}

@Injectable()
export class TransformTrackInterceptor<T>
  extends SerializerInterceptor
  implements NestInterceptor<T, Response<T>>
{
  constructor(private readonly abilityFactory: AbilityFactory) {
    super();
  }

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    const req = context.switchToHttp().getRequest<RequestWithTrack>();
    const ability: AppAbility = this.abilityFactory.createForUser(req.user);

    return next.handle().pipe(
      map((data) => {
        //in case there is TrackEntity[]
        if (Array.isArray(data)) {
          data = data.map((track: Track) => {
            const isOwner = ability.can(
              Action.ReadPrivateData,
              subject('Track', track),
            );

            return classToPlain(track, { groups: [isOwner ? 'isOwner' : ''] });
          });
        } else {
          const isOwner = ability.can(
            Action.ReadPrivateData,
            subject('Track', data),
          );

          data = classToPlain(data, { groups: [isOwner ? 'isOwner' : ''] });
        }

        return data;
      }),
    );
  }
}
