module.exports = mongoose => {
    const MemberSchema = mongoose.Schema(
        {
            member_id: Number,
            name: String,
            email: String,
            jobTitle: String,
            department: String,
            project_manager: [{ type: mongoose.Schema.Types.ObjectId, ref: "projects" }]
        }
    )

    MemberSchema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id;
        return object
    })

    const Member = mongoose.model("members", MemberSchema)
    return Member
}