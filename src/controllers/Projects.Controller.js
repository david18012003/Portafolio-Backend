import { pool } from "../database/Conection.js";

// Obtener todos los proyectos
export const getAllProjects = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM projects");

    // Verificamos si se obtuvieron datos
    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron proyectos" });
    }

    // Si hay proyectos, los retornamos
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

    if (rows.length === 0) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener proyecto por ID:", error.message);
    res.status(500).json({ error: "Error al obtener el proyecto" });
  }
};

export const createProject = async (req, res) => {
  try {
    const { name, description, status, user_id } = req.body;

    // Verificamos que los campos necesarios no estén vacíos
    if (!name || !description || !status || !user_id) {
      return res.status(400).json({ error: "Faltan campos requeridos para crear el proyecto" });
    }

    // Si la fecha de creación es obligatoria, puedes establecerla aquí
    const created_at = new Date();

    // Preparar los datos para la inserción
    const [result] = await pool.query("INSERT INTO projects (name, description, status, user_id, created_at) VALUES (?, ?, ?, ?, ?)", [
      name,
      description,
      status,
      user_id,
      created_at
    ]);

    res.status(201).json({ message: "Proyecto creado con éxito", projectId: result.insertId });
  } catch (error) {
    console.error("Error al crear el proyecto:", error.message);
    res.status(500).json({ error: "Error al crear el proyecto" });
  }
};


// Actualizar un proyecto por ID
export const updateProjectById = async (req, res) => {
  const { id } = req.params;
  const { title, description, technologies, status } = req.body;

  try {
    // Verificamos si el proyecto existe
    const [existing] = await pool.query("SELECT * FROM projects WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

    const updatedProject = {
      title: title ?? existing[0].title,
      description: description ?? existing[0].description,
      technologies: technologies ?? existing[0].technologies,
      status: status ?? existing[0].status,
    };

    const updated_at = new Date();
    const [result] = await pool.query(
      "UPDATE projects SET title = ?, description = ?, technologies = ?, status = ?, updated_at = ? WHERE id = ?",
      [
        updatedProject.title,
        updatedProject.description,
        updatedProject.technologies,
        updatedProject.status,
        updated_at,
        id,
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

// Eliminar un proyecto por ID
export const deleteProjectById = async (req, res) => {
  const { id } = req.params;

  try {
    const [check] = await pool.query("SELECT id FROM projects WHERE id = ?", [id]);

    if (check.length === 0) {
      return res.status(404).json({ message: "Proyecto no encontrado" });
    }

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
