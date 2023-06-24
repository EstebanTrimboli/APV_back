/* eslint-disable react/display-name */
import express from 'express'
import 'dotenv/config'
import dotenv from 'dotenv'
import conectarDB from './config/db.js'
import cors from 'cors'
import veterinarioRoutes from './routes/veterinarioRoutes.js'
import pacienteRoutes from './routes/pacienteRoutes.js'

const app = express()

app.use(express.json())

dotenv.config()

const dominiosPermitidos = [process.env.FRONTEND_URL]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || dominiosPermitidos.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('No permitido por CORS'))
    }
  }
}

conectarDB()
app.use(cors(corsOptions))

app.use('/api/veterinarios', veterinarioRoutes)

app.use('/api/pacientes', pacienteRoutes)

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})
