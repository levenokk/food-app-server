import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { User } from '../../users/models/user.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';

type CreateAttr = {
  latitude: string;
  longitude: string;
  user_id: number;
};

@ObjectType()
@Table({
  tableName: 'extra_addresses',
  updatedAt: false,
  createdAt: false,
})
export class ExtraAddress extends Model<CreateAttr> {
  @Field(() => ID)
  @Column({
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  })
  id: number;

  @Field(() => String)
  @Column
  latitude: string;

  @Field(() => String)
  @Column
  longitude: string;

  @ForeignKey(() => User)
  @Column
  user_id: number;
}
