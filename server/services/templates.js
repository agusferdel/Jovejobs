export const welcomeTemplate = (email, name, lastname, activateLink) => ({
  subject: `Bienvenid@ a JoveJobs, ${name}`,
  textPlain: `Hola ${name} ${lastname},

    Te damos la bienvenida a JoveJobs. Tu cuenta asociada al correo ${email} ha sido creada correctamente.

    Para empezar a utilizar la plataforma, activa tu cuenta desde este enlace:
    ${activateLink}

    Si no reconoces este registro, puedes ignorar este mensaje.`,

  html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <h2>Bienvenid@ a JoveJobs</h2>
      <p>Hola ${name} ${lastname},</p>
      <p>Te damos la bienvenida a <strong>JoveJobs</strong>. Tu cuenta asociada al correo <strong>${email}</strong> ha sido creada correctamente.</p>
      <p>Para empezar a utilizar la plataforma, activa tu cuenta haciendo clic en el botón de abajo.</p>
      <p style="margin: 24px 0;">
        <a href="${activateLink}" style="background-color: #FF3DD5; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block;">
          Activar cuenta
        </a>
      </p>
      <p>Si no reconoces este registro, puedes ignorar este mensaje.</p>
    </div>
  `,
});

export const resetPasswordTemplate = (name, resetLink) => ({
  subject: `Recuperación de contraseña en JoveJobs`,
  textPlain: `Hola ${name},

    En esta página puedes proceder con la recuperación de tu contraseña.

    Si no enviaste la solicitud, ignora este mensaje. En su lugar, puedes utilizar el siguiente enlace para restablecerla:

    ${resetLink}`,

  html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <p>Hola ${name},</p>
      <p>En esta página puedes proceder con la recuperación de tu contraseña.</p>
      <p>Si no enviaste la solicitud, ignora este mensaje. En su lugar, puedes hacer clic en el botón a continuación para restablecerla.</p>
      <p style="margin: 24px 0;">
        <a href="${resetLink}" style="background-color: #FF3DD5; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 6px; display: inline-block;">
          Restablecer contraseña
        </a>
      </p>
    </div>
  `,
});

export const resetPasswordConfirmationTemplate = (name) => ({
  subject: `Contraseña actualizada correctamente en JoveJobs`,
  textPlain: `Hola ${name},

    Te confirmamos que tu contraseña se ha actualizado correctamente.

    Si no has realizado este cambio, contacta con soporte lo antes posible.`,

  html: `
    <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
      <p>Hola ${name},</p>
      <p>Te confirmamos que tu contraseña se ha actualizado correctamente.</p>
      <p>Si no has realizado este cambio, contacta con soporte lo antes posible.</p>
    </div>
  `,
});