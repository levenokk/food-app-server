import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Institution } from '../../institutions/models';

type CreateAttr = {
  name: string;
  image: string;
  price: number;
  stock_price: number;
  stock_time: number;
  composition: string;
  institution_id: number;
};

@ObjectType()
@Table({
  tableName: 'dishes',
  createdAt: false,
  updatedAt: false,
})
export class Dish extends Model<CreateAttr> {
  @Field(() => ID)
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Field(() => String)
  @Column({
    type: DataType.STRING({
      length: 30,
    }),
  })
  name: string;

  @Field(() => String)
  @Column
  image: string;

  @Field(() => Float)
  @Column({
    type: DataType.FLOAT,
  })
  price: number;

  @Field(() => Float)
  @Column({
    type: DataType.FLOAT,
  })
  stock_price: number;

  @Field(() => Date)
  @Column({
    type: DataType.DATE,
  })
  stock_time: string;

  @Field(() => String)
  @Column
  composition: string;

  @ForeignKey(() => Institution)
  institution_id: number;

  @Field(() => Institution)
  @BelongsTo(() => Institution)
  institution: Institution;
}
