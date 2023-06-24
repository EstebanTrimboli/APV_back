import jwt from 'jsonwebtoken'
import Veterinario from '../models/Veterinario.js'

const checkAuth = async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) { // Si trae header de autorización y empieza con Bearer...
    try {
      token = req.headers.authorization.split(' ')[1] // .split divide el string y forma un arreglo. Le pido que devuelva el índice 1 (Le saca el 'bearer' al token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      req.veterinario = await Veterinario.findById(decoded.id).select('-password -token -confirmado')
      return next()
    } catch (error) {
      const err = new Error('Token no válido')
      return res.status(403).json({ msg: err.message })
    }
  }

  if (!token) {
    const error = new Error('Token no válido o inexistente')
    res.status(403).json({ msg: error.message })
  }

  return next()
}

export default checkAuth
