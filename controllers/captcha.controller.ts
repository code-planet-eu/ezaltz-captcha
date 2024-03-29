import { Request, Response } from 'express'
import { createCanvas, CanvasRenderingContext2D, Canvas, Image } from 'canvas'
import fs from 'fs'
import crypto from 'crypto'

const secret = process.env.CAPTCHA_SECRET || 'EZAltz'
const iv = process.env.CAPTCHA_IV || 'EZAltz'

const generateCaptcha = async (req: Request, res: Response) => {
  const hash = req.query.hash as string
  const qText = (req.query.text as string) || 'EZAltz'

  const text = hash ? decrypt(hash) : qText

  const canvas = createCanvas(600, 300)
  const context = canvas.getContext('2d')

  fillBackground(context, canvas)
  addBlob(context, canvas)
  generateWatermark(context, canvas)

  context.font = 'bold 80px Arial'
  context.textAlign = 'center'

  const greenColor = '#55FF99'
  const textColor = '#FFF'
  context.globalAlpha = 1

  text.split('').forEach((letter, index) => {
    const x = 300 + (index - text.length / 2) * 80
    const y = Math.random() * 100 + 100

    context.fillStyle = index < text.length / 2 ? greenColor : textColor
    // add shadow
    context.shadowColor = '#000'
    context.shadowBlur = 10
    context.shadowOffsetX = 5
    context.shadowOffsetY = 5

    context.fillText(letter, x, y)
  })

  const buffer = canvas.toBuffer('image/png')

  res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': buffer.length,
  })

  res.end(buffer)
}

export default {
  generateCaptcha,
}

const fillBackground = (context: CanvasRenderingContext2D, canvas: Canvas) => {
  context.fillStyle = '#161B22'
  context.fillRect(0, 0, canvas.width, canvas.height)
}

const addBlob = (context: CanvasRenderingContext2D, canvas: Canvas) => {
  const file = fs.readFileSync('src/blob.svg')
  const svg = new Image()

  svg.src = file

  context.drawImage(svg, canvas.width - 411, 0, 411, 387)
}

const generateWatermark = (context: CanvasRenderingContext2D, _canvas: Canvas) => {
  const text = 'EZAltz'
  const colors = ['#47BFFF', '#55FF99', '#CE6E6E', '#c9d1d9']
  const greenColor = colors[Math.floor(Math.random() * colors.length)]
  const colors2 = ['#FFC0CB', '#FFD700', '#FFA500', '#FF69B4']
  const textColor = colors2[Math.floor(Math.random() * colors2.length)]

  context.font = 'bold 50px Arial'
  context.textBaseline = 'middle'

  const numRows = 7 // number of rows
  const rowHeight = 50 // height of each row
  context.globalAlpha = 0.8

  for (let j = 0; j < numRows; j++) {
    const start = Math.floor(Math.random() * -150)
    for (let i = 0; i < 5; i++) {
      context.fillStyle = greenColor
      context.fillText(text.slice(0, 2), start + i * 200, j * rowHeight)

      context.fillStyle = textColor
      context.fillText(text.slice(2), context.measureText(text.slice(0, 2)).width + start + i * 200, j * rowHeight)
    }
  }
}

const decrypt = (encryptedText: string) => {
  const decipher = crypto.createDecipheriv('aes-256-cbc', secret, iv)
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedText, 'hex')), decipher.final()])
  return decrypted.toString('utf8')
}
