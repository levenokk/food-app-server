import { Field, InputType } from '@nestjs/graphql';
import { UserPayMethod } from '../../models';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType({
  description: 'Input for update user',
})
export class UpdateUserInput {
  id: number;

  @Field(() => String, {
    nullable: true,
  })
  name?: string;

  @Field(() => GraphQLUpload, {
    nullable: true,
  })
  image?: FileUpload;

  @Field(() => Boolean, {
    nullable: true,
  })
  position: boolean;

  @Field(() => Boolean, {
    nullable: true,
  })
  notification?: boolean;

  @Field(() => [UserPayMethod], {
    nullable: true,
  })
  pay_methods?: UserPayMethod[];
}
