module.exports = mongoose => {
    const ProjectSchema = mongoose.Schema(
        {
            project_id: Number,
            name: String,
            description: String,
            start_dates: Date,
            end_dates: Date,
            status: String,
            file: String,
            project_manager_id: { type: mongoose.Schema.Types.ObjectId, ref: "members" }
        }
    )

    ProjectSchema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id;
        return object
    })

    const Project = mongoose.model("projects", ProjectSchema)
    return Project
}