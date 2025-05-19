import express from "express";
import PDFDocument from "pdfkit";
import axios from "axios";
import { pool } from "../database/Conection.js";
import { generarRespuestaCohere } from "../controllers/Chatbot.Controller.js";
import path from "path";
import { fileURLToPath } from "url";

const pdfRoutes = express.Router();

// Utilidades para rutas absolutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

pdfRoutes.get("/pdf", async (req, res) => {
  try {
    // Obtener datos del usuario
    const [perfilRows] = await pool.query("SELECT * FROM users LIMIT 1");
    const perfil = perfilRows[0];

    // Obtener respuestas IA dentro del endpoint
    const experienciaTexto = await generarRespuestaCohere(
      "Resume tu experiencia laboral más relevante. muy breve."
    );
    const educacionTexto = await generarRespuestaCohere(
      "Resume brevemente tu formación académica. muy breve."
    );
    const idiomasTexto = await generarRespuestaCohere(
      "Enumera los idiomas que hablas con su nivel de dominio. muy breve."
    );
    const proyectosTexto = await generarRespuestaCohere(
      "Menciona tus proyectos más importantes con tecnologías usadas. muy breve."
    );
    const hobbyTexto = await generarRespuestaCohere(
      "Enumera tus hobbies. muy breve. son estos 💻 Programación y Desarrollo,📱 Testing de Software (QA), 📚 Aprendizaje Continuo, 🧑‍💻 Optimización de Código, 🏋️‍♂️ Ejercicio y Bienestar, 🌐 Tecnología y Nuevas Innovaciones, 🧩 Juegos de Lógica o Retos Mentales"
    );

    // Habilidades (asumiendo que perfil.skills es un JSON con arreglo)
    const habilidades = perfil.skills
      ? JSON.parse(perfil.skills).join(", ")
      : "Sin habilidades";

    const doc = new PDFDocument({ size: "A4", margin: 0 });

    res.setHeader("Content-disposition", "attachment; filename=HojaDeVida.pdf");
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    // Fondo columna izquierda
    doc.rect(0, 0, 180, 842).fill("#2c2c2c");

    // Foto del perfil
    if (perfil.photoUrl) {
      try {
        const imageBuffer = await axios.get(perfil.photoUrl, {
          responseType: "arraybuffer",
        });
        doc.image(imageBuffer.data, 40, 40, { width: 100, height: 100 });
      } catch (error) {
        console.log("No se pudo cargar la imagen:", error.message);
      }
    }

    // Información de contacto
    let y = 160;
    doc.fillColor("#fff").fontSize(10).text("Contact", 30, y);
    y += 20;

    doc.image(path.join(__dirname, "../assets/icons/telefono.png"), 30, y, {
      width: 10,
      height: 10,
    });
    doc.text(perfil.phone || "-", 45, y);
    y += 20;

    doc.image(path.join(__dirname, "../assets/icons/email.png"), 30, y, {
      width: 10,
      height: 10,
    });
    doc.text(perfil.email || "-", 45, y);
    y += 20;

    doc.image(path.join(__dirname, "../assets/icons/ubicacion.png"), 30, y, {
      width: 10,
      height: 10,
    });
    doc.text(perfil.address || "Dirección no disponible", 45, y);
    y += 30;

    // Redes sociales
    doc.fontSize(8).fillColor("#fff").text("Social Account", 30, y);
    y += 15;

    doc.image("src/assets/icons/linkedin.png", 30, y, {
      width: 10,
      height: 10,
    });
    doc.text(perfil.linkedin || "-", 45, y, {
      width: 120,
      lineBreak: true,
    });
    y += 25;

    doc.image("src/assets/icons/github.png", 30, y, { width: 10, height: 10 });
    doc.text(perfil.github || "-", 45, y, {
      width: 120,
      lineBreak: true,
    });
    y += 25;

    // Habilidades
    doc.moveDown().text("Skills", 30, y);
    y += 15;
    doc.text(habilidades, 30, y, { width: 120 });
    y += 40;

    // Hobbies
    doc.moveDown().text("Hobby", 30, y);
    y += 15;
    doc.text(hobbyTexto || "Sin hobbies", 30, y, { width: 120 });

    // Volver a columna derecha (contenido principal)
    const rightX = 200;
    let rightY = 40;

    // Nombre y bio
    doc
      .fillColor("#000")
      .fontSize(20)
      .text(perfil.name || "Sin nombre", rightX, rightY);
    rightY += 30;
    doc
      .fontSize(12)
      .fillColor("#444")
      .text(perfil.bio || "Desarrollador Web", rightX, rightY);

    // Perfil
    rightY += 40;
    doc.fontSize(14).fillColor("#0056b3").text("Perfil", rightX, rightY);
    rightY += 20;
    doc
      .fontSize(10)
      .fillColor("#000")
      .text(experienciaTexto || "Sin información.", rightX, rightY, {
        width: 370,
      });

    // Experiencia
    rightY += 100;
    doc
      .fontSize(14)
      .fillColor("#0056b3")
      .text("Experiencia ", rightX, rightY);
    rightY += 20;
    doc
      .fontSize(10)
      .fillColor("#000")
      .text(experienciaTexto || "Sin experiencia.", rightX, rightY, {
        width: 370,
      });

    // Educación
    rightY += 100;
    doc.fontSize(14).fillColor("#0056b3").text("Educacion", rightX, rightY);
    rightY += 20;
    doc
      .fontSize(10)
      .fillColor("#000")
      .text(educacionTexto || "Sin formación.", rightX, rightY, { width: 370 });

    // Idiomas
    rightY += 100;
    doc.fontSize(14).fillColor("#0056b3").text("Idiomas", rightX, rightY);
    rightY += 20;
    doc
      .fontSize(10)
      .fillColor("#000")
      .text(idiomasTexto || "Sin idiomas.", rightX, rightY, { width: 370 });

    // Proyectos
    rightY += 100;
    doc.fontSize(14).fillColor("#0056b3").text("Proyectos", rightX, rightY);
    rightY += 20;
    doc
      .fontSize(10)
      .fillColor("#000")
      .text(proyectosTexto || "Sin proyectos.", rightX, rightY, { width: 370 });

    doc.end();
  } catch (error) {
    console.error("Error al generar el PDF:", error.message);
    res.status(500).json({ error: "Error al generar el PDF" });
  }
});

export default pdfRoutes;
