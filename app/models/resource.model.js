module.exports = mongoose => {
    const schema = mongoose.Schema(
        {
            id: Number,
            name: String,
            type: String,
            quantity: Number,
        }
    )

    schema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id;
        return object
    })

    const Resource = mongoose.model("resources", schema)
    return Resource
}