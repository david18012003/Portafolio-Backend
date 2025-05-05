import { pool } from "../database/Conection.js";


export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");

    // Verificamos si se obtuvieron datos
    if (rows.length === 0) {
      return res.status(404).json({ message: "No se encontraron usuarios" });
    }

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message);
    res.status(500).json({ error: "Error al obtener los usuarios" });
  }
};

// Obtener usuario por ID
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) throw new Error("ID de usuario no proporcionado");

    const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error.message);
    res.status(500).json({ error: "Error al obtener el usuario" });
  }
};

export const createUser = async (req, res) => {
  try {
    const { name, email, linkedin, github, bio, skills, languages, experience, education, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Faltan campos requeridos para crear el usuario" });
    }

    const created_at = new Date();

    // Convertir skills y languages a JSON antes de la inserción
    const skillsJson = skills ? JSON.stringify(skills) : null;
    const languagesJson = languages ? JSON.stringify(languages) : null;
    const experienceJson = experience ? JSON.stringify(experience) : null;
    const educationJson = education ? JSON.stringify(education) : null;

    // Preparar los datos para la inserción
    const [result] = await pool.query("INSERT INTO users SET ?", {
      name,
      email,
      linkedin,
      github,
      bio,
      skills: skillsJson, // Convertimos skills a JSON
      languages: languagesJson, // Convertimos languages a JSON
      experience: experienceJson, // Convertimos experience a JSON
      education: educationJson, // Convertimos education a JSON
      phone,
      created_at,
    });

    res.status(201).json({ message: "Usuario creado con éxito", userId: result.insertId });
  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};


// Actualizar usuario por ID
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, linkedin, github, bio, skills, languages, experience, education, phone } = req.body;

    if (!id) throw new Error("ID de usuario no proporcionado");

    const [existing] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);

    if (existing.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const updatedUser = {
      name: name ?? existing[0].name,
      email: email ?? existing[0].email,
      linkedin: linkedin ?? existing[0].linkedin,
      github: github ?? existing[0].github,
      bio: bio ?? existing[0].bio,
      skills: skills ? JSON.stringify(skills) : existing[0].skills,
      languages: languages ? JSON.stringify(languages) : existing[0].languages,
      experience: experience ? JSON.stringify(experience) : existing[0].experience,
      education: education ? JSON.stringify(education) : existing[0].education,
      phone: phone ?? existing[0].phone,
    };

    const updated_at = new Date();
    const [result] = await pool.query(
      "UPDATE users SET name = ?, email = ?, linkedin = ?, github = ?, bio = ?, skills = ?, languages = ?, experience = ?, education = ?, phone = ?, updated_at = ? WHERE id = ?",
      [
        updatedUser.name,
        updatedUser.email,
        updatedUser.linkedin,
        updatedUser.github,
        updatedUser.bio,
        updatedUser.skills,
        updatedUser.languages,
        updatedUser.experience,
        updatedUser.education,
        updatedUser.phone,
        updated_at,
        id,
      ]
    );

    if (result.affectedRows > 0) {
      res.json({ message: "Usuario actualizado con éxito" });
    } else {
      res.status(400).json({ error: "No se realizaron cambios en el usuario" });
    }
  } catch (error) {
    console.error("Error al actualizar usuario:", error.message);
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
};

// Eliminar usuario por ID
export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) throw new Error("ID de usuario no proporcionado");

    const [check] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);

    if (check.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const [result] = await pool.query("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows > 0) {
      res.json({ message: "Usuario eliminado con éxito" });
    } else {
      res.status(400).json({ error: "No se pudo eliminar el usuario" });
    }
  } catch (error) {
    console.error("Error al eliminar usuario:", error.message);
    res.status(500).json({ error: "Error al eliminar el usuario" });
  }
};
