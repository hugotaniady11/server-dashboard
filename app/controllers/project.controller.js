const db = require('../models')
const Project = db.projects

exports.getProjects = async (req,res) => {
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
            project_id: 1,
              project_name: 1,
              project_description: 1,
              start_date: 1,
              end_date: 1,
              status: 1,
              project_manager_id: "$manager.id",
              project_manager_name: "$manager.name"
            }
          }
        ]);
        res.json({success: true, projects});
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server Error" });
      }
       
}

exports.getProjectById = async (req, res) => {
    try {
        const project = await Project.findOne({project_id : req.params.project_id});
        if (!project) {
          return res.status(404).json({ message: 'Project not found' });
        }
        const { project_name, project_description, start_dates, end_dates, status, project_manager_name, project_manager_id } = project;
        return res.json({
            project_id: req.params.project_id,
            project_name,
            project_description,
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
        const { project_id, project_name, project_description, start_dates, end_dates, project_manager_id, status } = req.body;
    
        const project = new Project({
        project_id,
        project_name,
        project_description,
        start_dates,
        end_dates,
        project_manager_id,
        status
        });
    
        await project.save();
        res.json({success: true, project});
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
      }
}

exports.deleteProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndDelete(id);
        if (!project) {
          return res.status(404).json({ message: 'Project not found' });
        }
        return res.json({ message: 'Project deleted successfully', project });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }
}

exports.updateProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project.findByIdAndUpdate(id, req.body, { new: true });
        if (!project) {
          return res.status(404).json({ message: 'Project not found' });
        }
        return res.json({ message: 'Project updated successfully', project });
      } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Server error' });
      }
}