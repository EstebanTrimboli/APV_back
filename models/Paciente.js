import mongoose from 'mongoose'
import Veterinario from './Veterinario.js'

const pacienteSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  humano: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  fecha: {
    type: Date,
    required: true,
    default: JSON.stringify(Date.now())
  },
  sintomas: {
    type: String,
    required: true
  },
  veterinario: { // Asocio el paciente a un Veterinario
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Veterinario'
  }
},

{
  timestamps: true
}

)

const Paciente = mongoose.model('Paciente', pacienteSchema) // Genero el modelo Paciente, basado en el Schema pacienteSchema

export default Paciente
