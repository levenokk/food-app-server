import {
  Column,
  Model,
  Table,
  DataType,
  HasMany,
  BelongsToMany,
  HasOne,
} from 'sequelize-typescript';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { UserExtraAddress } from '../../extra-address/models';
import { Institution, InstitutionEvaluation } from '../../institutions/models';
import { InstitutionOrder } from '../../orders/models';
import { Dish, FavoriteDish } from '../../dishes/models';
import { FavoriteInstitutions } from '../../institutions/models';
import { UserPay } from './user-pay-method.model';

type CreateAttr = {
  phone_number: string;
  name?: string;
  is_partner: boolean;
  is_new?: boolean;
  image?: string;
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

  @Field(() => Int)
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

  @Field(() => [InstitutionOrder])
  @HasMany(() => InstitutionOrder)
  orders: InstitutionOrder[];

  @BelongsToMany(() => Dish, () => FavoriteDish)
  favorite_dishes: Dish[];

  @BelongsToMany(() => Institution, () => FavoriteInstitutions)
  favorite_institutions: FavoriteInstitutions[];

  @Field(() => [UserPay], {
    defaultValue: [],
  })
  @HasMany(() => UserPay)
  pay_methods: UserPay[];

  @Field(() => Institution)
  @HasOne(() => Institution, {
    foreignKey: 'user_id',
  })
  institution: Institution;

  @HasMany(() => InstitutionEvaluation)
  institution_evaluations: InstitutionEvaluation[];
}
