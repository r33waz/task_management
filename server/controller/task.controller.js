import pool from "../utils/dbConnection.js";

import path from "path";


export const CreateTask = async (req, res) => {
  console.log("req.file", req.file);
  const { title, description, userid, due_date } = req.body;
  console.log(userid)

  try {
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

    if (!due_date) {
      return res.status(400).json({
        status: false,
        message: "Please provide due date",
      });
    }

    let imageUrl = null; 

    if (req.file) {
      const filePath = req.file.path;
      console.log("filePath", filePath);
      imageUrl = `http://localhost:8085/uploads/${path.basename(filePath)}`;
    }

    const createdDate =
      req.body.created_at || new Date().toISOString().split("T")[0];

    const result = await pool.query(
      "INSERT INTO task (title, description, file, userid, created_at, due_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, description, imageUrl, userid, createdDate, due_date]
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

    const result = await pool.query(
      `SELECT title,
       description, 
       file, 
       userid, 
       TO_CHAR(created_at, 'YYYY-MM-DD') as created_at,
       TO_CHAR(due_date, 'YYYY-MM-DD') as due_date, 
       status, 
       task_id 
       FROM task WHERE userid = $1 ORDER BY created_at ASC `,
      [id]
    );

    const tasksWithFileNames = result.rows.map((task) => {
      return {
        ...task,
        file: task.file ? task.file.split("/").pop() : null,
      };
    });

    return res.status(200).json({
      status: true,
      data: tasksWithFileNames,
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
  const { title, description, created_at, status,due_date } = req.body;
  console.log("req.file", req.file);

  try {
    const task = await pool.query("SELECT * FROM task WHERE task_id = $1", [
      id,
    ]);

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
           due_date = COALESCE($5, due_date) ,
           status = COALESCE($6, status)
       WHERE task_id = $7 RETURNING *`,
      [
        title,
        description,
        imageUrl,
        created_at || task.rows[0].created_at,
        due_date || task.rows[0].due_date,
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
