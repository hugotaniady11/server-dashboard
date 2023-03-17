const db = require('../models')
const Resource = db.resources

exports.createResource = async (req, res) => {
    const { id, name, type, quantity } = req.body

    const existingResource = await Resource.findOne({
        $or: [{ id }, { name }],
    })

    if (existingResource) {
        return res.status(400).json({
            message: "Resource has been made"
        })
    }

    await Resource.create({
        id : id,
        name: name,
        type : type,
        quantity: quantity
    })

    res.status(201).json({
        message: "Resource registered!",
        data: { id, name, type, quantity }
    })
}

exports.getResources = async (req, res) => {
    let { page, limit, sort, asc } = req.query;
    const skip = (page - 1 ) * 10;
    if(!page) page = 1;
    if(!limit) limit = 10;


    try {

        const resources = await Resource.find().sort({ [sort] : asc }).skip(skip).limit(limit);
        const formattedResources = resources.map((resource) => ({
            id: resource.id,
            name: resource.name,
            type: resource.type,
            quantity: resource.quantity,
        }));



        res.status(200).json({ resources: formattedResources, page:page, limit:limit });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.getResourceById = async (req, res) => {
    try {
        const resource = await Resource.findOne({ id: req.params.id });
        if (!resource) {
            return res.status(404).json({ message: 'Resource not found' });
        }
        const { name, type, quantity } = resource;
        res.status(200).json({ id: req.params.id, name, type, quantity });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
}

exports.updateResourceById = async (req, res) => {
    const { id } = req.params;
  const { name, type, quantity } = req.body;

  try {
    const updatedResource = await Resource.findOneAndUpdate(
      { id },
      { name, type, quantity },
      { new: true }
    );

    if (!updatedResource) {
      return res.status(404).json({ message: 'Resource not found.' });
    }

    const { _id, ...resourceData } = updatedResource._doc;
        const response = {
            id: resourceData.id,
            name: resourceData.name,
            type: resourceData.type,
            quantity: resourceData.quantity,
        };

    return res.json({ message: 'Resource updated successfully.', data: response });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}


exports.deleteResourceById = async (req, res) => {
    const resourceId = req.params.id;

    try {
        const deletedResource = await Resource.findOneAndDelete({ id : resourceId });

        if (!deletedResource) {
            return res.status(404).json({ message: `Resource with ID ${resourceId} not found` });
        }
        

        return res.json({ message: `Resource with ID ${resourceId} successfully deleted` });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}