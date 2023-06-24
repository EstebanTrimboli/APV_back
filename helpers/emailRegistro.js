import nodemailer from 'nodemailer'
import nodemailerSendgrid from 'nodemailer-sendgrid'

const emailRegistro = async (datos) => {
  // const transporter = nodemailer.createTransport({
  //   host: process.env.EMAIL_HOST,
  //   port: process.env.EMAIL_PORT,
  //   auth: {
  //     user: process.env.EMAIL_USER,
  //     pass: process.env.EMAIL_PASS
  //   }
  // })
    const transporter = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY
      })
    )

  const { email, nombre, token } = datos

  const info = {
    from: 'apvsoportecontacto@gmail.com',
    to: email,
    subject: 'Confirmá tu cuenta en APV',
    text: 'Confirmá tu cuenta en APV',
    html: `<body>
            <table border=”0” cellpadding=”3” cellspacing=”0” width=”100%”>
              <tr>
                <td align=”center” valign=”top”>
                  <table border=”0” cellpadding=”20” cellspacing=”0” width=”600”>
                    <tr style="margin: 0 auto">
                      <td align=”center” valign=”top” style=”font-family:
                       Arial, Helvetica, sans-serif; color: #ccc; font-size: 11px;”>
                        
                          <h2>¡Bienvenida/o ${nombre} a APV - Administrador de Pacientes de Veterinaria!</h2>
                        
                        
                          <p> Ya creamos tu cuenta, sólo falta que confirmes tu email en el siguiente enlace:</p>
                        
                        
                          <button style="bg-indigo-700 text-white font-bold hover:bg-indigo-800 hover:cursor-pointer"><a href=" ${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar cuenta</a></button>
                        
                          <p>Si no solicitaste crear una cuenta, por favor ignorá este mensaje.</p>
                        
                          <p>Gracias por elegir nuestro servicio.</p>
                          <p>APV</p>
                         </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          <body/>`,

    dsn: {
          id: 'mail debugger',
          return: 'headers',
          notify: ['delay', 'failure'],
          recipient: 'estebantrimboli@gmail.com'
          }

  }
  await transporter.sendMail(info)

}

export default emailRegistro
