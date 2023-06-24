import nodemailer from 'nodemailer'

const emailOlvidePassword = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  const { email, nombre, token } = datos

  const info = await transporter.sendMail({
    from: 'APV - Administrador de Pacientes de Veterinaria',
    to: email,
    subject: 'Reestablecé tu Password de APV',
    text: 'Reestablecé tu Password de APV',
    html: `<h2>Hola ${nombre}, has solicitado reestablecer tu password.</h2>
            <p> Ingresá al siguiente enlace para generar una nueva contraseña:</p>
            <p><a href=" ${process.env.FRONTEND_URL}/olvide-password/${token}">Reestablecer Password</a></p>
            
            <p>Si no solicitaste el reestablecimiento de contraseña, por favor ignorá este mensaje.</p>
            
            <p>Gracias por elegir nuestro software.</p>
            <p>  APV.</p>`

  })
}

export default emailOlvidePassword
