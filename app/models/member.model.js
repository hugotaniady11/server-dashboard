module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            id: Number,
            name: String,
            email: String,
            jobTitle: String,
            department: String
        }
    )

    schema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id;
        return object
    })

    const Member = mongoose.model("members", schema)
    return Member
}