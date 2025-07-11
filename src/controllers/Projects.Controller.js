import { pool } from "../database/Conection.js";

// Obtener todos los proyectos
export const getAllProjects = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects");
    if (rows.length === 0) return res.status(404).json({ message: "No se encontraron proyectos" });
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener proyectos:", error.message);
    res.status(500).json({ error: "Error al obtener los proyectos" });
  }
};

// Obtener proyecto por ID
export const getProjectById = async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query("SELECT * FROM projects WHERE id = ?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Proyecto no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener proyecto por ID:", error.message);
    res.status(500).json({ error: "Error al obtener el proyecto" });
  }
};

// Crear proyecto
export const createProject = async (req, res) => {
  try {
    const { title, description, technologies, status, user_id, link } = req.body;
    const image = req.file?.filename || null;
    const created_at = new Date();
console.log('TECH:', req.body.technologies);
console.log('TYPE:', typeof req.body.technologies);

    if (!title || !description || !status || !user_id) {
      return res.status(400).json({ error: "Faltan campos requeridos para crear el proyecto" });
    }

    const [result] = await pool.query(
      `INSERT INTO projects (title, description, technologies, status, user_id, link, image, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [title, description, technologies, status, user_id, link, image, created_at]
    );

    res.status(201).json({ message: "Proyecto creado con éxito", projectId: result.insertId });
  } catch (error) {
    console.error("Error al crear el proyecto:", error.message);
    res.status(500).json({ error: "Error al crear el proyecto" });
  }
};

// Actualizar proyecto
export const updateProjectById = async (req, res) => {
  const { id } = req.params;
  const { title, description, technologies, status, link } = req.body;
  const newImage = req.file?.filename;

  try {
    const [existing] = await pool.query("SELECT * FROM projects WHERE id = ?", [id]);
    if (existing.length === 0) return res.status(404).json({ message: "Proyecto no encontrado" });

    const updatedProject = {
      title: title ?? existing[0].title,
      description: description ?? existing[0].description,
      technologies: technologies ? technologies : existing[0].technologies,
      status: status ?? existing[0].status,
      link: link ?? existing[0].link,
      image: newImage ?? existing[0].image,
    };

    const updated_at = new Date();

    const [result] = await pool.query(
      `UPDATE projects SET title = ?, description = ?, technologies = ?, status = ?, link = ?, image = ?, updated_at = ? WHERE id = ?`,
      [
        updatedProject.title,
        updatedProject.description,
        updatedProject.technologies,
        updatedProject.status,
        updatedProject.link,
        updatedProject.image,
        updated_at,
        id
      ]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Proyecto actualizado con éxito" });
    } else {
      res.status(400).json({ message: "No se pudo actualizar el proyecto" });
    }
  } catch (error) {
    console.error("Error al actualizar el proyecto:", error.message);
    res.status(500).json({ error: "Error al actualizar el proyecto" });
  }
};


// Eliminar proyecto
export const deleteProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const [check] = await pool.query("SELECT id FROM projects WHERE id = ?", [id]);
    if (check.length === 0) return res.status(404).json({ message: "Proyecto no encontrado" });

    const [result] = await pool.query("DELETE FROM projects WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: "Proyecto eliminado con éxito" });
    } else {
      res.status(400).json({ message: "No se pudo eliminar el proyecto" });
    }
  } catch (error) {
    console.error("Error al eliminar el proyecto:", error.message);
    res.status(500).json({ error: "Error al eliminar el proyecto" });
  }
};

// Proyectos por usuario
export const getProjectsByUserId = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await pool.query("SELECT * FROM projects WHERE user_id = ?", [user_id]);
    if (rows.length === 0) return res.status(404).json({ message: "No se encontraron proyectos para este usuario" });
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener proyectos por user_id:", error.message);
    res.status(500).json({ error: "Error al obtener los proyectos del usuario" });
  }
};
