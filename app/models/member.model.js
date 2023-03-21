module.exports = mongoose => {
    const MemberSchema = mongoose.Schema(
        {
            id: Number,
            name: String,
            email: String,
            jobTitle: String,
            department: String
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