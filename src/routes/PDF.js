import express from 'express';
import PDFDocument from 'pdfkit';
import axios from 'axios';
import { pool } from '../database/Conection.js';

const pdfRoutes = express.Router();

pdfRoutes.get('/cv', async (req, res) => {
  try {
    const [perfilRows] = await pool.query("SELECT * FROM users LIMIT 1");
    const [proyectosRows] = await pool.query("SELECT * FROM projects");

    const perfil = perfilRows[0];
    const proyectos = proyectosRows.map(p =>
      `• ${p.title} (${p.technologies})\n  Estado: ${p.Status}\n  Link: ${p.link}`
    ).join('\n\n');

    const habilidades = JSON.parse(perfil.skills || '[]').join(', ');
    const idiomas = JSON.parse(perfil.languages || '[]').join(', ');

    const doc = new PDFDocument({ size: 'A4', margin: 0 });

    res.setHeader('Content-disposition', 'attachment; filename=HojaDeVida.pdf');
    res.setHeader('Content-type', 'application/pdf');
    doc.pipe(res);

    // FONDO COLUMNA IZQUIERDA
    doc.rect(0, 0, 180, 842).fill('#2c2c2c');

    // FOTO DEL PERFIL
    if (perfil.photoUrl) {
      try {
        const imageBuffer = await axios.get(perfil.photoUrl, { responseType: 'arraybuffer' });
        doc.image(imageBuffer.data, 40, 40, { width: 100, height: 100 });
      } catch (error) {
        console.log('No se pudo cargar la imagen:', error.message);
      }
    }

    // INFORMACIÓN DE CONTACTO
    doc.fillColor('#fff').fontSize(10).text('Contact', 30, 160);
    doc.moveDown(0.5);
    doc.text(`📞 ${perfil.phone}`);
    doc.text(`✉️ ${perfil.email}`);
    doc.text(`📍 ${perfil.address || 'Dirección no disponible'}`);

    // REDES SOCIALES
    doc.moveDown().text('Social Account');
    doc.text(`LinkedIn: ${perfil.linkedin || '-'}`);
    doc.text(`GitHub: ${perfil.github || '-'}`);

    // HABILIDADES
    doc.moveDown().text('Skills');
    doc.text(habilidades || 'Sin habilidades');

    // HOBBIES (puedes extenderlo desde la base de datos si lo agregas)
    doc.moveDown().text('Hobby');
    doc.text('🎮 Videojuegos\n📚 Lectura\n🌎 Viajar');

    // VOLVER A COLUMNA DERECHA (contenido principal)
    const rightX = 200;
    let y = 40;

    // NOMBRE Y BIO
    doc.fillColor('#000').fontSize(20).text(perfil.name, rightX, y);
    y += 30;
    doc.fontSize(12).fillColor('#444').text(perfil.bio || 'Desarrollador Web', rightX, y);

    // PERFIL
    y += 40;
    doc.fontSize(14).fillColor('#0056b3').text('Profile', rightX, y);
    y += 20;
    doc.fontSize(10).fillColor('#000').text(perfil.profile || 'Sin información.', rightX, y, { width: 370 });

    // EXPERIENCIA
    y += 100;
    doc.fontSize(14).fillColor('#0056b3').text('Work Experience', rightX, y);
    y += 20;
    doc.fontSize(10).fillColor('#000').text(perfil.experience || 'Sin experiencia.', rightX, y, { width: 370 });

    // EDUCACIÓN
    y += 100;
    doc.fontSize(14).fillColor('#0056b3').text('Education', rightX, y);
    y += 20;
    doc.fontSize(10).fillColor('#000').text(perfil.education || 'Sin formación.', rightX, y, { width: 370 });

    // IDIOMAS
    y += 100;
    doc.fontSize(14).fillColor('#0056b3').text('Languages', rightX, y);
    y += 20;
    doc.fontSize(10).fillColor('#000').text(idiomas || 'Sin idiomas.', rightX, y, { width: 370 });

    // PROYECTOS
    y += 100;
    doc.fontSize(14).fillColor('#0056b3').text('Projects', rightX, y);
    y += 20;
    doc.fontSize(10).fillColor('#000').text(proyectos || 'Sin proyectos.', rightX, y, { width: 370 });

    doc.end();
  } catch (error) {
    console.error("Error al generar el PDF:", error.message);
    res.status(500).json({ error: "Error al generar el PDF" });
  }
});

export default pdfRoutes;
