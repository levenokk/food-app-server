import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Institution } from '../../institutions/models';

type CreateAttr = {
  latitude: string;
  longitude: string;
  institution_id: number;
};

@ObjectType()
@Table({
  tableName: 'institution_extra_addresses',
  updatedAt: false,
  createdAt: false,
})
export class InstitutionExtraAddress extends Model<CreateAttr> {
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

  @ForeignKey(() => Institution)
  @Column
  institution_id: number;
}
