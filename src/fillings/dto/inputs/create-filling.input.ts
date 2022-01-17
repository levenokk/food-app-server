import { Field, Float, InputType } from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

@InputType()
export class CreateFillingInput {
  @Field(() => String)
  name: string;

  @Field(() => Float)
  price: number;

  @Field(() => Float)
  weight: number;

  @Field(() => GraphQLUpload)
  image: FileUpload;
}
