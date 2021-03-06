import { Injectable } from '@nestjs/common';
import * as AWS from 'aws-sdk';
import { readFileSync, unlink } from 'fs';

@Injectable()
export class S3Service {
  AWS_S3_BUCKET = process.env.AWS_S3_BUCKET;
  s3 = new AWS.S3({
    accessKeyId: process.env.AWS_S3_ACCESS_KEY,
    secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    region: process.env.AWS_DEFAULT_REGION,
  });

  async uploadFile(file, path) {
    const stream = readFileSync(file.path);
    await this.s3Upload(this.AWS_S3_BUCKET, path, stream);
    unlink(file.path, err => {
      if (err) {
        console.log(err);
      }
    });
  }

  async s3Upload(bucket, name, file) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Body: file,
    };

    try {
      await this.s3.upload(params).promise();
      console.log('Route: ', `https://${bucket}.s3.amazonaws.com/${name}`);
    } catch (e) {
      console.log(e);
    }
  }

  async tempLink(bucket, name) {
    const params = {
      Bucket: bucket,
      Key: String(name),
      Expires: 60 * 60,
    };

    try {
      await this.s3.getSignedUrl('getObject', params);
    } catch (e) {
      console.log(e);
    }
  }
}
