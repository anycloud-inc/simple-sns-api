import * as Multer from 'multer'
import { Request, Response } from 'express'
import logger from 'src/lib/logger'
import { mkdirSync } from 'fs'
import generateHash from '../generate-hash'
import AppError from 'src/error/AppError'
import CloudStorage from './cloud-storage'
import { LOCAL_UPLOADS_DIR } from 'src/constants'

const FIELD_NAME = 'file' // ※送る側のキー名と同じにすること

export const upload =
  process.env.UPLOAD_TO_CLOUD === '1' ? uploadToCloud : uploadToLocal

function getDestination(folderName: string) {
  return `${folderName}`
}

function getFileName(file: Express.Multer.File) {
  const random = generateHash()
  return `${Date.now()}-${random}-${file.originalname}`
}

function getFilePath(folderName: string, file: Express.Multer.File) {
  return `${getDestination(folderName)}/${getFileName(file)}`
}

function uploadToLocal(
  req: Request,
  res: Response,
  folderName: string
): Promise<{ fields: any; url: string }> {
  const destination = getDestination(LOCAL_UPLOADS_DIR + '/' + folderName)
  mkdirSync(destination, { recursive: true })
  const storage = Multer.diskStorage({
    destination,
    filename: (_req, file, cb) => cb(null, getFileName(file)),
  })

  const multer = Multer({
    storage,
    limits: {
      fileSize: 10 * 1024 * 1024, // no larger than 10MB
    },
  })

  return new Promise((resolve, reject) => {
    logger.log('Uploading file to local...')
    multer.single(FIELD_NAME)(req, res, (err: any) => {
      if (err != null) return reject(err)
      if (req.file == null)
        return reject(new AppError('fileを指定してください'))
      const baseURL = req.protocol + '://' + req.get('host')
      resolve({ fields: req.body, url: `${baseURL}/${req.file!.path}` })
    })
  })
}

function uploadToCloud(
  req: Request,
  res: Response,
  folderName: string
): Promise<{ fields: any; url: string }> {
  const storage = Multer.memoryStorage()

  const multer = Multer({
    storage,
    limits: {
      fileSize: 20 * 1024 * 1024, // no larger than 20MB
    },
  })

  return new Promise((resolve, reject) => {
    logger.log('Uploading file to cloud...')

    multer.single(FIELD_NAME)(req, res, (err: any) => {
      if (!req.file) return reject('File required')
      if (err) return reject('MulterError: ' + err)
      CloudStorage.upload(req.file.buffer, getFilePath(folderName, req.file))
        .then(url =>
          resolve({
            fields: req.body,
            url,
          })
        )
        .catch(err => reject(err))
    })
  })
}
