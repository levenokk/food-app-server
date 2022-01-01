import { Column, Model, Table, DataType, HasMany } from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { ExtraAddress } from '../../extra-address/models/extra.address.model';

type CreateAttr = {
  phone_number: string;
  name: string;
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
    type: DataType.INTEGER({
      length: 6,
      decimals: 6,
    }),
  })
  code: number;

  @Field(() => String)
  @Column({
    allowNull: false,
  })
  name: string;

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

  @Field(() => [ExtraAddress], {
    nullable: true,
    defaultValue: [],
  })
  @HasMany(() => ExtraAddress, {
    onDelete: 'CASCADE',
  })
  extra_addresses: typeof ExtraAddress[];
}
