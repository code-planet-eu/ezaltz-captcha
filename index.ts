import crypto from 'crypto'

import './lib/server'

const secret = process.env.CAPTCHA_SECRET || 'EZAltz'
const iv = process.env.CAPTCHA_IV || 'EZAltz'

const encrypt = (text: string) => {
  const cipher = crypto.createCipheriv('aes-256-cbc', secret, iv)
  const encrypted = Buffer.concat([cipher.update(text, 'utf8'), cipher.final()])
  return encrypted.toString('hex')
}

// usage
const text = '4h0EZj'
const encrypted = encrypt(text)
console.log('Encrypted:', encrypted)
