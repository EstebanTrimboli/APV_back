import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import generarId from '../helpers/generarId.js'

// Defino el Schema de Veterinario
const veterinarioSchema = mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  telefono: {
    type: String,
    default: null,
    trim: true
  },
  web: {
    type: String,
    default: null
  },
  token: {
    type: String,
    default: generarId()
  },
  confirmado: {
    type: Boolean,
    default: false
  }
})

// Antes de usar save()...
veterinarioSchema.pre('save', async function (next) { // sintaxis function (no arrow fn), pq voy a usar this para referirme al obj actual, no a la ventana global
  if (!this.isModified('password')) { // Si el pass ya está hasheado...
    next() // salteo el resto de la función
  }

  const salt = await bcrypt.genSalt(10) // Seteo la cantidad de rondas (salt) de hasheo para los passwords
  this.password = await bcrypt.hash(this.password, salt)
})

veterinarioSchema.methods.comprobarPassword = async function (passwordForm) {
  return await bcrypt.compare(passwordForm, this.password)
}

// Registro el modelo en mongoose para que interactue con la BD y le paso el Schema
const Veterinario = mongoose.model('Veterinario', veterinarioSchema)

export default Veterinario
