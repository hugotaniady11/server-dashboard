const db = require('../models')
const Project = db.projects
const Member = db.members
const mongoose = require('mongoose');

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.aggregate([
      {
        $lookup: {
          from: "members",
          localField: "project_manager_id",
          foreignField: "id",
          as: "manager"
        }
      },
      {
        $unwind: "$manager"
      },
      {
        $project: {
          id: 1,
          name: 1,
          description: 1,
          start_date: 1,
          end_date: 1,
          status: 1,
          manager: {
            project_manager_id: "$manager.id",
            project_manager_name: "$manager.name"
          }
        }
      }
    ]);
    res.json({ success: true, projects });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }

}

exports.getProjectById = async (req, res) => {
  
  try {
    const project = await Project.findOne({ id: req.params.id });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const { name, description, start_dates, end_dates, status, project_manager_name, project_manager_id } = project;
    return res.status(200).json({
      id: req.params.id,
      name,
      description,
      start_dates,
      end_dates,
      status,
      project_manager_name,
      project_manager_id
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }

}

exports.createProject = async (req, res) => {
  try {
    const { id, name, description, start_dates, end_dates, project_manager_id, status } = req.body;

    const projectManager = await Member.findOne({ id: project_manager_id }, { name: 1 });

    const existProject = await Project.findOne({
      $or: [{ id }, { name }],
  })
  if (existProject) {
    return res.status(400).json({
        message: "Project has been made"
    })
}

    const project = new Project({
      id,
      name,
      description,
      start_dates,
      end_dates,
      project_manager_id,
      project_manager_name: projectManager.name,
      status
    });

    await project.save();
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: {
        id: project.id,
      name: project.name,
      description: project.description,
      start_dates: project.start_dates,
      end_dates: project.end_dates,
      status: project.status,
      project_manager_id: project.project_manager_id,
      project_manager_name: project.project_manager_name
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

exports.deleteProjectById = async (req, res) => {
  const projectId = req.params.id;

  try {
    const deletedProject = await Project.findOneAndDelete({ id: projectId });

    if (!deletedProject) {
      return res.status(404).json({ message: `Project with ID ${projectId} not found` });
    }

    return res.json({ message: `Project with ID ${projectId} successfully deleted` });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

exports.updateProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, start_dates, end_dates, project_manager_id, status } = req.body;

    const updatedProject = await Project.findOneAndUpdate(
      { id },
      { name, description, start_dates, end_dates, project_manager_id, status },
      { new: true }
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    const { _id, ...projectData } = updatedProject._doc;
    const response = {
      id: projectData.id,
      name: projectData.name,
      description: projectData.description,
      start_dates: projectData.start_dates,
      end_dates: projectData.end_dates,
      project_manager_id: projectData.project_manager_id,
      project_manager_name: projectData.project_manager_name,
      status: projectData.status
    };

    return res.json({ message: 'Project updated successfully', data: response });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}