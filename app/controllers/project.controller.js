const db = require('../models')
const Project = db.projects
const Member = db.members
const path = require('path')
const fs = require('fs')

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find().populate("project_manager_id");
    res.status(200).json(projects);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }

}

exports.getProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({ project_id: req.params.project_id }).populate("project_manager_id");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }

}

exports.createProject = async (req, res) => {
  try {
    const { project_id, name, description, start_dates, end_dates, status, project_manager_id } = req.body;
    const file = req.file.path;

    const existingName = await Project.findOne({
      $or: [{ project_id }, { name }]
    })

    if (existingName) {
      return res.status(400).json({
        message: "Project has been made"
      })
    }

    // Check if the provided project ID exists
    const existingManager = await Member.findById(project_manager_id);
    if (!existingManager) {
      return res.status(400).json({ message: "Project Manager does not exist" });
    }

    // Create a new invoice object
    const newProject = new Project({
      project_id,
      name,
      description,
      start_dates,
      end_dates,
      project_manager_id: existingManager._id,
      status,
      file,
    });

    // Save the new invoice to the database
    const savedProject = await newProject.save();

    const member = await Member.findById(project_manager_id);
    member.project_manager = savedProject._id;
    await member.save();

    // Populate the project data and return the saved invoice with project data
    const populatedProject = await Project.findById(savedProject._id).populate("project_manager_id");

    res.status(201).json({success: true, data: populatedProject});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
}

exports.deleteProjectById = async (req, res) => {
  const projectId = req.params.project_id;
    try {
        const project = await Project.findOneAndDelete({ project_id: projectId });

        if (!project) {
            return res.status(404).json({ message: `Project with number ${projectId} not found` });
        }
        removeFile(project.image);
        res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.updateProjectById = async (req, res) => {
  try {
    const { project_id, name, description, start_dates, end_dates, status, project_manager_id } = req.body;
    const file = req.file.path;

    const project = await Project.findOne({ project_id: req.params.project_id });

    if (!project) {
        return res.status(404).json({ message: "Invoice not found" });
    }

    project.project_id = project_id || project.project_id;
    project.name = name || project.name;
    project.description = description || project.description;
    project.start_dates = start_dates || project.start_dates;
    project.end_dates = end_dates || project.end_dates;
    project.status = status || project.status;
    project.file = file || project.file;
    project.project_manager_id = project_manager_id || project.project_manager_id;

    await project.save();

    res.status(200).json({ message: "Project updated successfully" });
} catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
}
}

const removeFile = (filePath) => {
  filePath = path.join(__dirname, '../..' , filePath);
  fs.unlink(filePath, err => {console.log(err)});
}