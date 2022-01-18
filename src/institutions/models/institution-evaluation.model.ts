import {
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Institution } from './institution.model';
import { User } from '../../users/models';

type CreateAttr = {
  institution_id: number;
  evaluation: number;
  user_id: number;
};

@Table({
  tableName: 'Institution_evaluations',
  createdAt: false,
  updatedAt: false,
})
export class InstitutionEvaluation extends Model<CreateAttr> {
  @Column({
    primaryKey: true,
    autoIncrement: true,
  })
  id: number;

  @ForeignKey(() => Institution)
  institution_id: number;

  @ForeignKey(() => User)
  user_id: number;

  @Column({
    type: DataType.FLOAT,
  })
  evaluation: number;
}
