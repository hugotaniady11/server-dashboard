module.exports = mongoose => {
    const ProjectSchema = mongoose.Schema(
        {
            id: Number,
            name: String,
            description: String,
            start_dates: Date,
            end_dates: Date,
            project_manager_id: { type: mongoose.Schema.Types.Number, ref: "Member" },
            project_manager_name: String,
            status: String
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