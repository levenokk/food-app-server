import { BelongsToMany, Column, Model, Table } from 'sequelize-typescript';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Institution } from '../../institutions/models';
import { InstitutionTag } from './institution-tag.model';
import { Dish } from '../../dishes/models/dish.model';
import { DishTag } from './dish-tag.model';

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

  @BelongsToMany(() => Institution, () => InstitutionTag)
  institutions: Institution[];

  @BelongsToMany(() => Dish, () => DishTag)
  dishes: Dish[];
}
