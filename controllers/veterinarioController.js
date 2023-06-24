/* eslint-disable camelcase */
import Veterinario from '../models/Veterinario.js'
import generarJWT from '../helpers/generarJWT.js'
import generarId from '../helpers/generarId.js'
import emailRegistro from '../helpers/emailRegistro.js'
import emailOlvidePassword from '../helpers/emailOlvidePassword.js'

const registrar = async (req, res) => {
  const { email, nombre } = req.body

  const existeUsuario = await Veterinario.findOne({ email })

  if (existeUsuario) {
    const error = new Error(`Ya existe un usuario con el email ${email}`)
    return res.status(400).json({ msg: error.message })
  }

  try {
    // Guarda un nuevo veterinario
    const veterinario = new Veterinario(req.body) // Creo una instancia del esquema con la info del req.body
    const veterinarioAlmacenado = await veterinario.save() // La almaceno con el mértodo .save() de mongoose

    // Envía el email de confirmación de cuenta
    emailRegistro({
      nombre,
      email,
      token: veterinarioAlmacenado.token
    })

    res.json(veterinarioAlmacenado)
  } catch (error) {
    console.log(error)
  }
}

const perfil = (req, res) => {
  const { veterinario } = req
  res.json(veterinario)
}

const confirmar = async (req, res) => {
  const { token } = req.params // Con req.params accedo a los parámetros del request
  const usuarioConfirmar = await Veterinario.findOne({ token })

  if (!usuarioConfirmar) { // Si el el usuario no tiene el token...
    const error = new Error('Token no válido')
    return res.status(404).json({ msg: error.messsage }) // ...le respondo con un error 404
  }

  try {
    usuarioConfirmar.token = null // Si pasa la validación, borro el token usado
    usuarioConfirmar.confirmado = true // cambio el atrib confirmado a true
    await usuarioConfirmar.save() // y vuelvo a guardar el registro en la BD
    res.json({ msg: 'Usuario confirmado correctamente' })
  } catch (error) {
    const err = new Error('Token no válido')
    return res.status(404).json({ msg: err.messsage })
  }
}

const autenticar = async (req, res) => {
  const { email, password } = req.body

  const usuario = await Veterinario.findOne({email})

  if (!usuario) {
    const error = new Error('El usuario no existe')
    return res.status(404).json({ msg: error.message })
  }

  if (!usuario.confirmado) {
    const error = new Error('Cuenta no confirmada. Por favor revisá tu bandeja de entrada o el spam')
    return res.status(403).json({ msg: error.message })
  }

  if (await usuario.comprobarPassword(password)) {
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario.id)
    })
  } else {
    const error = new Error('El password es incorrecto')

    return res.status(403).json({ msg: error.message })
  }
}

const olvidePassword = async (req, res) => {
  const { email } = req.body
  const existeVeterinario = await Veterinario.findOne({ email })

  if (!existeVeterinario) {
    const error = new Error('El usuario no existe')
    return res.status(400).json({ msg: error.message })
  }

  try {
    existeVeterinario.token = generarId()
    await existeVeterinario.save()

    emailOlvidePassword({
      email,
      nombre: existeVeterinario.nombre,
      token: existeVeterinario.token
    })

    res.json({ msg: 'Hemos enviado un mail con las instrucciones' })
  } catch (error) {
    console.log(error)
  }
}

const comprobarToken = async (req, res) => {
  const { token } = req.params
  const tokenValido = await Veterinario.findOne({ token })

  if (tokenValido) {
    res.json({ msg: 'Token válido. Usuario comprobado' })
  } else {
    const error = new Error('Token no válido')
    return res.status(400).json({ msg: error.message })
  }
}

const nuevoPassword = async (req, res) => {
  const { token } = req.params
  const { password } = req.body

  const veterinario = await Veterinario.findOne({ token })

  if (!veterinario) {
    const error = new Error('Hubo un error')
    return res.status(400).json({ msg: error.message })
  }

  try {
    veterinario.token = null
    veterinario.password = password
    await veterinario.save()
    res.json({ msg: 'Password modificado correctamente' })
  } catch (error) {
    console.log(error)
  }
}

const actualizarPerfil = async (req, res) => {
  // request a la BD que busque una instancia del modelo Veterinario con un determinado id
  const veterinario = await Veterinario.findById(req.params.id)

  if (!veterinario) {
    const error = new Error('Hubo un error')
    return res.status(400).json({ msg: error.message })
  }
  const { email } = req.body

  if (veterinario.email !== req.body.email) {
    const existeEmail = await Veterinario.findOne({ email })

    if (existeEmail) {
      const error = new Error('El email ya está asignado a otro registro')
      return res.status(400).json({ msg: error.message })
    }
  }

  try {
    veterinario.nombre = req.body.nombre || veterinario.nombre
    veterinario.email = req.body.email || veterinario.email
    veterinario.telefono = req.body.telefono || veterinario.telefono
    veterinario.web = req.body.web || veterinario.web

    const veterinarioActualizado = await veterinario.save()
    res.json(veterinarioActualizado)
  } catch (error) {
    console.log(error)
  }
}

const actualizarPassword = async (req, res) => {
  // Leer los datos
  const { id } = req.veterinario
  const { pwd_actual, pwd_nuevo } = req.body

  // Verificar que el veterinario exista
  const veterinario = await Veterinario.findById(id)

  if (!veterinario) {
    const error = new Error('Hubo un error')
    return res.status(400).json({ msg: error.message })
  }

  // Comprobar su pass
  if (await veterinario.comprobarPassword(pwd_actual)) {
    // Almacenar el nuevo pass
    veterinario.password = pwd_nuevo
    await veterinario.save()
    res.json({ msg: 'Password actualizado correctamente' })
  } else {
    const error = new Error('El password actual es incorrecto')
    return res.status(400).json({ msg: error.message })
  }
}

export {
  registrar,
  perfil,
  confirmar,
  autenticar,
  olvidePassword,
  comprobarToken,
  nuevoPassword,
  actualizarPerfil,
  actualizarPassword
}
