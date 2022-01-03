import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Institution } from '../../institutions/models';
import { InstitutionsTag } from './institutions-tag.model';

type CreateAttr = {
  name: string;
};

@ObjectType()
@Table({
  tableName: 'tags',
  updatedAt: false,
  createdAt: false,
})
export class Tag extends Model<CreateAttr> {
  @Field(() => ID)
  @Column({
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Field(() => String)
  @Column({
    unique: true,
  })
  name: string;

  @BelongsToMany(() => Institution, () => InstitutionsTag)
  institutions: Institution[];
}
