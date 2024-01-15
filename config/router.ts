import { Router } from 'express'

import captchaRouter from '../routes/captcha.router'

const router = Router()

router.use('/', captchaRouter)

export default router
