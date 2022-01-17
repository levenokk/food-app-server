import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { createWriteStream, existsSync, mkdirSync, unlinkSync } from 'fs';
import { FileUpload } from 'graphql-upload';
import { join } from 'path';
import * as moment from 'moment';

@Injectable()
export class UploadService {
  public async uploadFile({
    createReadStream,
    filename,
  }: FileUpload): Promise<string> {
    return new Promise(async (resolve, reject) => {
      const file_name = moment().valueOf() + filename;
      const url = `/client/${file_name}`;

      mkdirSync(join(__dirname, '../../client'), {
        recursive: true,
      });

      return createReadStream()
        .pipe(createWriteStream(join(__dirname, '../../client', file_name)))
        .on('finish', () => resolve(url))
        .on('error', () => {
          reject(new InternalServerErrorException());
        });
    });
  }

  public async removeFile(url: string) {
    if (existsSync(join(__dirname, '../..', url))) {
      unlinkSync(join(__dirname, '../..', url));
      return true;
    } else {
      return false;
    }
  }
}
