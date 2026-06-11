import { Request, Response, NextFunction } from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const logStream = fs.createWriteStream(path.resolve(__dirname, '..', 'log.txt'), {
  flags: 'a',
})

export const requestLogger = (request: Request, response: Response, next: NextFunction) => {
  const timestamp = new Date().toISOString()
  const { method, url } = request
  const logEntry = `${timestamp} - ${method} ${url} ${request.body ? '- ' + request.body.content : ''}\n`
  logStream.write(logEntry)
  next()
}