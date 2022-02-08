import { Storage, Bucket, GetSignedUrlConfig } from '@google-cloud/storage'
import logger from 'src/lib/logger'

let storage: Storage
let bucket: Bucket
const BUCKET_NAME = process.env.GCS_BUCKET_NAME

try {
  storage = new Storage({
    projectId: process.env.GCP_PROJECT_ID,
    // 本番 (GAE)ではIAMが当たっているので鍵はいらない。ローカルで動作確認時に必要。
    keyFilename:
      process.env.NODE_ENV === 'production' ? undefined : 'gcs-key.json',
  })

  bucket = storage.bucket(BUCKET_NAME ?? '')
} catch (e) {
  if (process.env.UPLOAD_TO_CLOUD === '1') {
    logger.error(e)
  }
}

export default {
  // pathには /homepageshop-images/sample.jpg のようにフォルダ名とファイルを含める
  upload: (buffer: Buffer, path: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (storage == null || bucket == null) {
        return reject('Failed to setup Cloud Storage')
      }
      const blob = bucket.file(path)
      const blobStream = blob.createWriteStream()
      blobStream.on('error', reject)
      blobStream.on('finish', () => {
        resolve(getPublicUrl(blob.name))
      })
      blobStream.end(buffer)
    })
  },
  generateSignedUrl: async (url: string) => {
    if (!isCloudStorageUrl(url)) return url
    // These options will allow temporary read access to the file
    const options: GetSignedUrlConfig = {
      version: 'v2', // defaults to 'v2' if missing.
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60, // one hour
    }
    const filename = getFilename(url)
    // Get a v2 signed URL for the file
    const [signedUrl] = await bucket.file(filename).getSignedUrl(options)
    return signedUrl
  },
}

const backetUrl = `https://storage.googleapis.com/${BUCKET_NAME}`

export function getPublicUrl(filename: string) {
  return `${backetUrl}/${filename}`
}

function isCloudStorageUrl(url: string) {
  return url.match(backetUrl) != null
}

function getFilename(url: string) {
  const regexp = new RegExp(`${backetUrl}/(.*)`)
  const match = url.match(regexp)
  if (!match) throw Error('Url is invalid')

  return url.match(regexp) ? match[1] : url
}
