import express from "express";
import PDFDocument from "pdfkit";
import axios from "axios";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { pool } from "../database/Conection.js";

const pdfRoutes = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

pdfRoutes.get("/pdf/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) throw new Error("ID de usuario no proporcionado");
    const [perfilRows] = await pool.query(
      `SELECT * FROM users where id = ${userId}`
    );
    const perfil = perfilRows[0];
    console.log("Perfil:", perfil);

    const [experiencias] = await pool.query(
      "SELECT * FROM work_experience WHERE user_id = ?",
      [userId]
    );
    const [educaciones] = await pool.query(
      "SELECT * FROM education WHERE user_id = ?",
      [userId]
    );
    const [idiomas] = await pool.query(
      "SELECT * FROM languages WHERE user_id = ?",
      [userId]
    );
    const [proyectos] = await pool.query(
      "SELECT * FROM projects WHERE user_id = ?",
      [userId]
    );

    const habilidades = perfil.skills
      ? JSON.parse(perfil.skills).join(", ")
      : "Sin habilidades";

    const experienciaTexto = experiencias
      .map(
        (exp) =>
          `• ${exp.position} en ${exp.company_name} (${exp.type})\n  Funciones: ${exp.functions}\n`
      )
      .join("\n");
    const educacionTexto = educaciones
      .map(
        (edu) =>
          `• ${edu.title} - ${edu.institution} (${edu.level})\n  Estado: ${edu.status}`
      )
      .join("\n");
    const idiomasTexto = idiomas
      .map((idioma) => `• ${idioma.language} - Nivel: ${idioma.level}`)
      .join("\n");
    const proyectosTexto = proyectos
      .map(
        (proy) =>
          `• ${proy.title}\n  Tecnologías: ${
            proy.technologies || "-"
          }\n  Link: ${proy.link || "-"}`
      )
      .join("\n\n");
    const hobbyTexto =
      "💻 Programación y Desarrollo, 📱 Testing de Software (QA), 📚 Aprendizaje Continuo, 🧑‍💻 Optimización de Código, 🏋️ Ejercicio y Bienestar, 🌐 Tecnología y Nuevas Innovaciones, 🧩 Juegos de Lógica o Retos Mentales";

    const doc = new PDFDocument({ size: "A4", margin: 0 });
    doc.registerFont(
      "OpenSans",
      path.join(
        __dirname,
        "../assets/fonts/Open_Sans/static/OpenSans-Regular.ttf"
      )
    );
    doc.font("OpenSans"); // Establece como fuente por defecto

    const { download } = req.query;

    if (download === "true") {
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=Cesar_David_Carrillo_RodriguezCV.pdf"
      );
    } else {
      res.setHeader(
        "Content-Disposition",
        "inline; filename=Cesar_David_Carrillo_RodriguezCV.pdf"
      );
    }
    res.setHeader("Content-type", "application/pdf");
    doc.pipe(res);

    doc.rect(0, 0, 180, 842).fill("#2c2c2c");

    const imagePath = perfil.profile_picture_name
      ? path.join(__dirname, "../../uploads/", perfil.profile_picture_name)
      : null;
    if (imagePath && fs.existsSync(imagePath)) {
      const radius = 50;
      const centerX = 90;
      const centerY = 90;
      const imageX = centerX - radius;
      const imageY = centerY - radius;

      // 👇 recorta todo lo que venga después dentro del círculo
      doc.save(); // guarda el estado antes del clip
      doc.circle(centerX, centerY, radius).clip();
      doc.image(imagePath, imageX, imageY, {
        width: radius * 2,
        height: radius * 2,
      });
      doc.restore();
    }
    console.log("Ruta de la imagen:", imagePath);

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

    doc.fontSize(8).fillColor("#fff").text("Social Account", 30, y);
    y += 15;
    doc.image("src/assets/icons/linkedin.png", 30, y, {
      width: 10,
      height: 10,
    });
    doc.text(perfil.linkedin || "-", 45, y, { width: 120 });
    y += 25;
    doc.image("src/assets/icons/github.png", 30, y, { width: 10, height: 10 });
    doc.text(perfil.github || "-", 45, y, { width: 120 });
    y += 25;

    doc.moveDown().text("Skills", 30, y);
    y += 15;
    doc.text(habilidades, 30, y, { width: 120 });
    y += 40;

    doc.moveDown().text("Hobby", 30, y);
    y += 15;
    doc.text(hobbyTexto || "Sin hobbies", 30, y, { width: 120 });

    const rightX = 200;
    let rightY = 40;

    doc
      .fillColor("#000")
      .fontSize(20)
      .text(perfil.name || "Sin nombre", rightX, rightY);
    rightY += 30;
    doc
      .fontSize(12)
      .fillColor("#444")
      .text(perfil.bio || "Desarrollador Web", rightX, rightY);

    rightY += 40;
    doc.fontSize(14).fillColor("#0056b3").text("Perfil", rightX, rightY);
    rightY += 20;
    doc
      .fontSize(10)
      .fillColor("#000")
      .text(perfil.cv_summary || "Sin perfil.", rightX, rightY, { width: 370 });

    rightY += 150;
    doc.fontSize(14).fillColor("#0056b3").text("Experiencia ", rightX, rightY);
    rightY += 20;
    doc
      .fontSize(10)
      .fillColor("#000")
      .text(experienciaTexto || "Sin experiencia.", rightX, rightY, {
        width: 370,
      });

    rightY += 100;
    doc.fontSize(14).fillColor("#0056b3").text("Educación", rightX, rightY);
    rightY += 20;
    doc
      .fontSize(10)
      .fillColor("#000")
      .text(educacionTexto || "Sin formación.", rightX, rightY, { width: 370 });

    rightY += 100;
    doc.fontSize(14).fillColor("#0056b3").text("Idiomas", rightX, rightY);
    rightY += 20;
    doc
      .fontSize(10)
      .fillColor("#000")
      .text(idiomasTexto || "Sin idiomas.", rightX, rightY, { width: 370 });

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
