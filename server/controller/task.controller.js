import pool from "../utils/dbConnection.js";

import path from "path";

export const CreateTask = async (req, res) => {
  console.log("req.file", req.file);
  const { title, description, user_id, created_at } = req.body;
  console.log(title, description, created_at);

  try {
    // Validate the inputs
    if (!title) {
      return res.status(400).json({
        status: false,
        message: "Please provide title",
      });
    }

    if (!description) {
      return res.status(400).json({
        status: false,
        message: "Please provide description",
      });
    }

    const filePath = req.file.path;

    // Construct the URL for the image
    const imageUrl = `http://localhost:8085/uploads/${path.basename(filePath)}`;
    const createdDate = created_at
      ? created_at
      : new Date().toISOString().split("T")[0].slice(0, 10);

    const result = await pool.query(
      "INSERT INTO task (title, description, file, userid, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [title, description, imageUrl, user_id, created_at || createdDate]
    );

    return res.status(200).json({
      status: true,
      message: "Task created successfully",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

//get single user task

export const GetSingleUserTask = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const result = await pool.query("SELECT * FROM task WHERE userid = $1", [
      id,
    ]);
    return res.status(200).json({
      status: true,
      data: result.rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

//delete post
export const DeletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE from task where task_id=$1 ", [id]);
    if (result) {
      return res.status(200).json({
        status: true,
        message: "Post deleted successfully",
      });
    } else {
      return res.status(400).json({
        status: false,
        message: "Post not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

//eidit post
export const UpdateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description,  created_at,status } = req.body;

  try {
    const task = await pool.query("SELECT * FROM task WHERE task_id = $1", [id]);

    if (task.rows.length === 0) {
      return res.status(404).json({
        status: false,
        message: "Task not found",
      });
    }

    let imageUrl = task.rows[0].file; 

    if (req.file) {
      const filePath = req.file.path;
      imageUrl = `http://localhost:8085/uploads/${path.basename(filePath)}`;
    }

    const updatedTask = await pool.query(
      `UPDATE task 
       SET title = COALESCE($1, title), 
           description = COALESCE($2, description), 
           file = COALESCE($3, file), 
           created_at = COALESCE($4, created_at) ,
           status = COALESCE($5, status)
       WHERE task_id = $6 RETURNING *`,
      [
        title,
        description,
        imageUrl, 
        created_at || task.rows[0].created_at,
        status,
        id,
      ]
    );

    return res.status(200).json({
      status: true,
      message: "Task updated successfully",
      data: updatedTask.rows[0], 
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Internal server error",
    });
  }
};

