module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            email: String,
            username: String,
            password: String,
        }
    )

    schema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id;
        return object
    })

    const User = mongoose.model("users", schema)
    return User
}