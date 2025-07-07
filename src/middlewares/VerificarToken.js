import { pool } from '../database/Conection.js'; // Importa la conexión a la base de datos
import jwt from 'jsonwebtoken'; // Importa la librería para manejar JSON Web Tokens (JWT)

// Función para validar las credenciales de un usuario y generar un token de autenticación
export const validacion = async (req, res) => {
    try {
        const { correo, password } = req.body; // Obtiene las credenciales (correo y contraseña) del cuerpo de la solicitud

        // Consulta SQL para buscar un usuario con el correo y contraseña proporcionados
        const sql = `SELECT * FROM users WHERE email = '${correo}' AND password = '${password}'`;
        const [user] = await pool.query(sql);

        if (user.length > 0) {
            // Si se encuentra un usuario, genera un token JWT con una duración de 2 horas
            let token = jwt.sign({ user }, 'jasdkladsasdasdasd', { expiresIn: '2h' });

            // Responde con el usuario y el token generado
            return res.status(200).json({
                'usuario': user,
                'token': token
            });
        } else {
            // Si no se encuentra el usuario, responde con un error 404
            res.status(404).json({
                'status': 404,
                'mensaje': 'Usuario no autorizado'
            });
        }
    } catch (error) {
        // Manejo de errores del servidor
        res.status(500).json({
            mensaje: 'Error del servidor ' + error
        });
    }
};

// Función para validar el token enviado en las solicitudes
export const validarToken = async (req, res, next) => {
    try {
        let tokenClient = req.headers['token']; // Obtiene el token del encabezado de la solicitud

        if (!tokenClient) {
            // Si no se proporciona un token, responde con un error 404
            return res.status(404).json({
                mensaje: 'Token es requerido'
            });
        } else {
            // Verifica la validez del token
            jwt.verify(tokenClient, 'jasdkladsasdasdasd', (error, decoded) => {
                if (error) {
                    // Si el token no es válido o ha expirado, responde con un error 403
                    return res.status(403).json({
                        mensaje: 'El token ya expiró'
                    });
                } else {
                    // Si el token es válido, continúa con la siguiente función en la cadena de middleware
                    next();
                }
            });
        }
    } catch (error) {
        // Manejo de errores del servidor
        return res.status(500).json({
            status: 500,
            mensaje: 'Error del servidor ' + error
        });
    }
};
