import express, { NextFunction, Request, Response } from 'express'

import router from '../config/router'

const app = express()

app.use('/', router)

app.use((_req, res, next) => {
  res.status(404)

  next(new Error(`404 - Not found`))
})

app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  res.status(res.statusCode || 500)

  const error = {
    message: err.message || 'Internal Server Error',
    errors: err.errors || undefined,
  }

  res.json(error)
})

const port = process.env.PORT || 3000

app.listen(port, () => console.log(`server listening on http://localhost:${port}`))
