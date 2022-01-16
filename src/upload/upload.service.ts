import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createWriteStream, mkdirSync } from 'fs';
import { FileUpload } from 'graphql-upload';
import { join } from 'path';
import * as moment from 'moment';

@Injectable()
export class UploadService {
  public async uploadFile({ createReadStream, filename }: FileUpload): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const file_name = moment().valueOf() + filename;
      const date_today = moment().format('MM.DD.YYYY');
      const url = `/client/${date_today}/${file_name}`;

      mkdirSync(join(__dirname, '../../client', date_today), {
        recursive: true,
      });

      return createReadStream()
        .pipe(
          createWriteStream(
            join(__dirname, '../../client', date_today, file_name),
          ),
        )
        .on('finish', () => resolve(url))
        .on('error', () => {
          reject(new InternalServerErrorException());
        });
    });
  }
}
