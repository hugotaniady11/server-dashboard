module.exports = mongoose => {
    const UserSchema = mongoose.Schema(
        {
            email: String,
            username: String,
            password: String,
            account_type: String,
            createdAt: {
                type: Date,
                default: Date.now,
              },
        }
    )

    UserSchema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id;
        return object
    })

    const User = mongoose.model("users", UserSchema)
    return User
}