import express from 'express'
import cors from 'cors'
import 'express-async-errors'

import { handler as error } from './middlewares/error'
import routes from './routes'

import { PORT } from '#/constants/config'

const app = express()

app.use(express.json())
app.use(cors())
app.use(routes)
app.use(error)

app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`))
