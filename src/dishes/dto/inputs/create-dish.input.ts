import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class CreateDishInput {
  @Field(() => String)
  name: string;

  @Field(() => GraphQLUpload)
  image: FileUpload;

  @Field(() => Float)
  price: number;

  @Field(() => String)
  composition: string;

  @Field(() => [Int])
  tag_ids: number[];

  @Field(() => [Int])
  filling_ids: number[];
}
