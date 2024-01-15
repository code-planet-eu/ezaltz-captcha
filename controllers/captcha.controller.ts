import { Request, Response } from 'express'
import { createCanvas, CanvasRenderingContext2D, Canvas, Image } from 'canvas'
import fs from 'fs'

const generateCaptcha = async (req: Request, res: Response) => {
  const canvas = createCanvas(600, 300)
  const context = canvas.getContext('2d')

  fillBackground(context, canvas)
  addBlob(context, canvas)
  generateWatermark(context, canvas)

  context.font = 'bold 85px Arial'
  context.textAlign = 'center'

  const text = 'R4nD0mT3xt'
  const greenColor = '#55FF99'
  const textColor = '#FFF'
  context.globalAlpha = 1

  context.fillStyle = context.createLinearGradient(0, 0, canvas.width, 0)
  context.fillStyle.addColorStop(0, greenColor)
  context.fillStyle.addColorStop(1, textColor)

  context.fillText(text, canvas.width / 2, canvas.height / 2)

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
  const greenColor = '#55FF99'
  const textColor = '#FFF'

  context.font = 'bold 40px Arial'
  context.textBaseline = 'middle'

  const numRows = 7 // number of rows
  const rowHeight = 50 // height of each row
  context.globalAlpha = 0.5

  for (let j = 0; j < numRows; j++) {
    const start = Math.floor(Math.random() * -150)
    for (let i = 0; i < 5; i++) {
      context.fillStyle = greenColor
      context.fillText(text.slice(0, 2), start + i * 150, j * rowHeight)

      context.fillStyle = textColor
      context.fillText(text.slice(2), context.measureText(text.slice(0, 2)).width + start + i * 150, j * rowHeight)
    }
  }
}
