import {
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { WorkDay } from './work-day.model';
import { Dish } from '../../dishes/models/dish.model';
import { InstitutionTag, Tag } from '../../tags/models';
import { InstitutionExtraAddress } from '../../extra-address/models';
import { InstitutionPayMethod } from './pay-method.model';
import { Filling } from '../../fillings/models';
import { InstitutionOrder } from '../../orders/models';

type CreateAttr = {
  name: string;
  image: string;
  work_from: string;
  work_to: string;
  address: string;
  shipping_cost: number;
  free_delivery: number;
  user_id: number;
};

@ObjectType()
@Table({
  tableName: 'institutions',
})
export class Institution extends Model<CreateAttr> {
  @Field(() => ID)
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @Field(() => String)
  @Column({
    type: DataType.TEXT,
  })
  name: string;

  @ForeignKey(() => User)
  user_id: number;

  @Field(() => String)
  @Column
  image: string;

  @Field(() => String)
  @Column({
    type: DataType.STRING({
      length: 5,
    }),
  })
  work_from: string;

  @Field(() => String)
  @Column({
    type: DataType.STRING({
      length: 5,
    }),
  })
  work_to: string;

  @Field(() => String)
  @Column({
    type: DataType.STRING({
      length: 40,
    }),
  })
  address: string;

  @Field(() => Number)
  @Column({
    type: DataType.INTEGER({
      decimals: 5,
    }),
  })
  shipping_cost: number;

  @Field(() => Number)
  @Column({
    type: DataType.INTEGER({
      decimals: 5,
    }),
  })
  free_delivery: number;

  @Field(() => [WorkDay], {
    nullable: true,
    defaultValue: [],
  })
  @HasMany(() => WorkDay, {
    onDelete: 'CASCADE',
  })
  work_days: WorkDay[];

  @Field(() => [Dish], {
    nullable: true,
    defaultValue: [],
  })
  @HasMany(() => Dish, {
    onDelete: 'CASCADE',
  })
  dishes: Dish[];

  @Field(() => [Tag])
  @BelongsToMany(() => Tag, () => InstitutionTag)
  tags: Tag[];

  @Field(() => [InstitutionExtraAddress], {
    nullable: true,
    defaultValue: [],
  })
  @HasMany(() => InstitutionExtraAddress, {
    onDelete: 'CASCADE',
  })
  extra_addresses: typeof InstitutionExtraAddress[];

  @Field(() => [InstitutionPayMethod], {
    nullable: true,
    defaultValue: [],
  })
  @HasMany(() => InstitutionPayMethod, {
    onDelete: 'CASCADE',
  })
  pay_methods: typeof InstitutionPayMethod[];

  @Field(() => [Filling])
  @HasMany(() => Filling)
  fillings: Filling[];

  @HasMany(() => InstitutionOrder)
  orders: typeof InstitutionOrder[];
}
