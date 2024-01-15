import { Router } from 'express'

import controller from '../controllers/captcha.controller'

const router = Router()

router.get('/', controller.generateCaptcha)

export default router
