import { Field, ID, InputType } from '@nestjs/graphql';

@InputType({
  description: 'Input for update user',
})
export class UpdateUserInput {
  @Field(() => ID)
  id: string;

  @Field(() => String, {
    nullable: true,
  })
  name?: string;

  @Field(() => String, {
    nullable: true,
  })
  phone_number?: string;

  @Field(() => String, {
    nullable: true,
  })
  image?: string;

  @Field(() => Boolean, {
    nullable: true,
  })
  position: boolean;

  @Field(() => Boolean, {
    nullable: true,
  })
  notification?: boolean;
}
