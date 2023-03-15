module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            project_id: Number,
            project_name: String,
            project_description: String,
            start_dates: Date,
            end_dates: Date,
            project_manager_id: Number,
            status: String
        }
    )

    schema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id;
        return object
    })

    const Project = mongoose.model("projects", schema)
    return Project
}