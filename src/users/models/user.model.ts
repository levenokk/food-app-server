import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  HasOne,
  BelongsToMany,
} from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { UserExtraAddress } from '../../extra-address/models';
import { Institution } from '../../institutions/models';
import { InstitutionOrder } from '../../orders/models';
import { Dish, FavoriteDish } from '../../dishes/models';

type CreateAttr = {
  phone_number: string;
  name?: string;
  is_partner: boolean;
  is_new?: boolean;
};

@ObjectType()
@Table({
  tableName: 'users',
})
export class User extends Model<CreateAttr> {
  @Field(() => ID)
  @Column({
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Field(() => Number)
  @Column({
    allowNull: false,
    unique: true,
  })
  phone_number: string;

  @Column({
    allowNull: true,
  })
  code: string;

  @Field(() => String)
  @Column({
    allowNull: true,
  })
  name?: string;

  @Field(() => String)
  @Column({
    allowNull: true,
  })
  image: string;

  @Field(() => Boolean)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  notification: boolean;

  @Field(() => Boolean)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  position: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_partner: boolean;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  order_notifications: boolean;

  @Field(() => [UserExtraAddress], {
    nullable: true,
    defaultValue: [],
  })
  @HasMany(() => UserExtraAddress, {
    onDelete: 'CASCADE',
  })
  extra_addresses: typeof UserExtraAddress[];

  @Field(() => Boolean)
  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_new: boolean;

  @Field(() => Institution, {
    defaultValue: null,
    nullable: true,
  })
  @HasOne(() => Institution, {
    onDelete: 'CASCADE',
  })
  institution: Institution;

  @Field(() => [InstitutionOrder])
  @HasMany(() => InstitutionOrder)
  orders: InstitutionOrder[];

  @BelongsToMany(() => Dish, () => FavoriteDish)
  favorite_dishes: Dish[];
}
