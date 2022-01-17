import {
  Field,
  Float,
  ID,
  InputType,
  Int,
  registerEnumType,
} from '@nestjs/graphql';
import { GraphQLUpload, FileUpload } from 'graphql-upload';

export enum StockTime {
  ONE_DAY = 'ONE_DAY',
  ONE_WEEK = 'ONE_WEEK',
  TWO_WEEKS = 'TWO_WEEKS',
  ONE_MOUTH = 'ONE_MOUTH',
}

registerEnumType(StockTime, {
  name: 'StockTime',
});

@InputType()
export class UpdateDishInput {
  @Field(() => ID)
  id: number;

  @Field(() => String, {
    nullable: true,
  })
  name: string;

  @Field(() => GraphQLUpload, {
    nullable: true,
  })
  image: FileUpload;

  @Field(() => Float, {
    nullable: true,
  })
  price: number;

  @Field(() => Float, {
    nullable: true,
  })
  stock_price: number;

  @Field(() => StockTime, {
    nullable: true,
  })
  stock_time: StockTime | null;

  @Field(() => String, {
    nullable: true,
  })
  composition: string;

  @Field(() => [Int], {
    nullable: true,
    defaultValue: [],
  })
  tag_ids: number[];

  @Field(() => [Int], {
    nullable: true,
    defaultValue: [],
  })
  filling_ids: number[];
}
