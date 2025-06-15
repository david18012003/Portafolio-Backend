import axios from "axios";
import dotenv from "dotenv";
import { v4 as uuidv4 } from 'uuid';
import { pool } from "../database/Conection.js"
import { IP } from "../database/ip.js";

dotenv.config();

const sessionId = uuidv4(); // Puedes mover esto a una cookie o localStorage si es frontend

export const chatWithCohere = async (req, res) => {
  try {
    const { Mensaje } = req.body;
    const [rows] = await pool.query(
      `SELECT user_message, bot_response
       FROM chat_messages
       WHERE session_id = ?
       ORDER BY timestamp DESC
       LIMIT 4`,
      [sessionId]
    );
    const chat_history = rows.reverse().flatMap(row => ([
      { role: "USER", message: row.user_message },
      { role: "CHATBOT", message: row.bot_response }
    ]));

    console.log("Chat History:", chat_history);
    
    
    
    const [perfilRows] = await pool.query("SELECT * FROM users LIMIT 1");
    const [proyectosRows] = await pool.query("SELECT title, technologies FROM projects");

   

    const perfil = perfilRows[0];
    const nombreDelProyecto = proyectosRows.map(p => p.title).join(", ");
    const tecnologiasUsadas = proyectosRows.map(p => p.technologies).join(", ");
    const habilidades = perfilRows.map(h => h.skills).join(", ");

 console.log("Perfil Rows:", perfil.name);
    console.log("Proyectos Rows:", tecnologiasUsadas);
    console.log("Habilidades:", habilidades);
 
    // 2. Armar el preámbulo dinámico
    const preamble = `
    Eres un asistente virtual de ${perfil.name}, un ${perfil.bio}.
    Estos son los links de sus perfiles en cuentas como GitHub y LinkedIn: 
    - [GitHub](${perfil.github})
    - [LinkedIn](${perfil.linkedin})
    
    ${perfil.name} ha trabajado en proyectos como ${nombreDelProyecto}, utilizando tecnologías como ${tecnologiasUsadas}.
    También tiene habilidades en ${habilidades}, y ha trabajado con metodologías como Scrum.
    Tu función es responder preguntas sobre ${perfil.name}, su experiencia, habilidades y objetivos.
    Habla en tercera persona con tono profesional, claro y amable.
    Cuando menciones enlaces, hazlo en formato Markdown.
    si te piden mi cv u hoja de vida, puedes compartir este enlace:${IP}/api/pdf
    puedes poner [descargar pdf](${IP}/api/pdf) `;
    
    

    if (!Mensaje) {
      return res.status(400).json({ error: "Falta el campo 'Mensaje'" });
    }

    const response = await axios.post(
      "https://api.cohere.ai/v1/chat",
      {
        message: Mensaje,
        chat_history,
        model: "command-r-plus",
        temperature: 0.7,
        max_tokens: 300,
        preamble ,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = response.data.text || response.data.reply;

    // Guardar en base de datos
    await pool.query(
      `INSERT INTO chat_messages (session_id, user_message, bot_response) VALUES (?, ?, ?)`,
      [sessionId, Mensaje, reply]
    );

    res.json({ response: reply });
  } catch (error) {
    console.error("Error al comunicarse con Cohere:", error.message);
    res.status(500).json({ error: "Error al procesar la solicitud del chatbot" });
  }
};

export const generarRespuestaCohere = async (mensaje) => {
  if (!mensaje) {
    throw new Error("Falta el campo 'mensaje'");
  }

  // 1. Obtener historial de chat
  const [rows] = await pool.query(
    `SELECT user_message, bot_response
     FROM chat_messages
     WHERE session_id = ?
     ORDER BY timestamp DESC
     LIMIT 4`,
    [sessionId]
  );

  const chat_history = rows.reverse().flatMap(row => ([
    { role: "USER", message: row.user_message },
    { role: "CHATBOT", message: row.bot_response }
  ]));

  // 2. Obtener datos de perfil y proyectos
  const [perfilRows] = await pool.query("SELECT * FROM users LIMIT 1");
  const [proyectosRows] = await pool.query("SELECT title, technologies FROM projects");

  const perfil = perfilRows[0];
  const nombreDelProyecto = proyectosRows.map(p => p.title).join(", ");
  const tecnologiasUsadas = proyectosRows.map(p => p.technologies).join(", ");
  const habilidades = JSON.parse(perfil.skills || '[]').join(", ");

  // 3. Preambulo para el asistente
  const preamble = `
Eres un asistente virtual de ${perfil.name}, un ${perfil.bio}.
Estos son los links de sus perfiles en cuentas como GitHub y LinkedIn:
- [GitHub](${perfil.github})
- [LinkedIn](${perfil.linkedin})

${perfil.name} ha trabajado en proyectos como ${nombreDelProyecto}, utilizando tecnologías como ${tecnologiasUsadas}.
También tiene habilidades en ${habilidades}, y ha trabajado con metodologías como Scrum.
Tu función es responder preguntas sobre ${perfil.name}, su experiencia, habilidades y objetivos.
Habla en tercera persona con tono profesional, claro y amable.
Cuando menciones enlaces, hazlo en formato Markdown.
no siempre tienes que responder con mi nombre solo da la respuesta y ya 
`;

  // 4. Llamada a la API de Cohere
  const response = await axios.post(
    "https://api.cohere.ai/v1/chat",
    {
      message: mensaje,
      chat_history,
      model: "command-r-plus",
      temperature: 0.7,
      max_tokens: 300,
      preamble,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.COHERE_API_KEY}`,
        "Content-Type": "application/json",
      },
    }
  );

  const reply = response.data.text || response.data.reply;

  // 5. Guardar en base de datos
  await pool.query(
    `INSERT INTO chat_messages (session_id, user_message, bot_response) VALUES (?, ?, ?)`,
    [sessionId, mensaje, reply]
  );

  return reply;
};