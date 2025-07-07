import { pool } from "../database/Conection.js";

export const uploadUserPhoto = async (req, res) => {
  try {
    const { id } = req.params;
    const fileName = req.file.filename;

    // Verificar si el usuario existe
    const [user] = await pool.query("SELECT id FROM users WHERE id = ?", [id]);
    if (user.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Actualizar campo profile_picture_name
    await pool.query("UPDATE users SET profile_picture_name = ? WHERE id = ?", [fileName, id]);

    res.json({ message: "Imagen subida correctamente", file: fileName });
  } catch (error) {
    console.error("Error al subir imagen:", error.message);
    res.status(500).json({ error: "Error al subir la imagen" });
  }
};

// Obtener todos los usuarios
export const getAllUsers = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM users");

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

// Crear nuevo usuario con imagen
export const createUser = async (req, res) => {
  try {
    const {
      name, email, linkedin, github, bio, skills, languages,
      experience, education, phone, address, license,
      cv_summary, age
    } = req.body;

    const profile_picture_name = req.file?.filename || null;

    if (!name || !email || !phone) {
      return res.status(400).json({ error: "Faltan campos requeridos para crear el usuario" });
    }

    const created_at = new Date();

    const [result] = await pool.query("INSERT INTO users SET ?", {
      name,
      email,
      linkedin,
      github,
      bio,
      skills: skills ? JSON.stringify(skills) : null,
      languages: languages ? JSON.stringify(languages) : null,
      experience: experience ? JSON.stringify(experience) : null,
      education: education ? JSON.stringify(education) : null,
      phone,
      address,
      license,
      cv_summary,
      age,
      profile_picture_name,
      created_at
    });

    res.status(201).json({ message: "Usuario creado con éxito", userId: result.insertId });
  } catch (error) {
    console.error("Error al crear el usuario:", error.message);
    res.status(500).json({ error: "Error al crear el usuario" });
  }
};

// Actualizar usuario con posible nueva imagen
export const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name, email, linkedin, github, bio, skills, languages,
      experience, education, phone, address, license,
      cv_summary, age
    } = req.body;

    const newProfilePicture = req.file?.filename;

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
      address: address ?? existing[0].address,
      license: license ?? existing[0].license,
      cv_summary: cv_summary ?? existing[0].cv_summary,
      age: age ?? existing[0].age,
      profile_picture_name: newProfilePicture ?? existing[0].profile_picture_name
    };

    const updated_at = new Date();

    const [result] = await pool.query(
      `UPDATE users SET 
        name = ?, email = ?, linkedin = ?, github = ?, bio = ?, 
        skills = ?, languages = ?, experience = ?, education = ?, phone = ?, 
        address = ?, license = ?, cv_summary = ?, age = ?, profile_picture_name = ?, 
        updated_at = ? 
      WHERE id = ?`,
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
        updatedUser.address,
        updatedUser.license,
        updatedUser.cv_summary,
        updatedUser.age,
        updatedUser.profile_picture_name,
        updated_at,
        id
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
