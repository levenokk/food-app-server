import { ForeignKey, Model, Table } from 'sequelize-typescript';
import { Tag } from './tag.model';
import { Institution } from '../../institutions/models';

@Table({
  tableName: 'institution_tags',
  createdAt: false,
  updatedAt: false,
})
export class InstitutionTag extends Model {
  @ForeignKey(() => Tag)
  tag_id: number;

  @ForeignKey(() => Institution)
  institution_id: number;
}
