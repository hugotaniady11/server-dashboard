module.exports = mongoose => {
    const ResourceSchema = mongoose.Schema(
        {
            id: Number,
            name: String,
            type: String,
            quantity: Number,
        }
    )

    ResourceSchema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id;
        return object
    })

    const Resource = mongoose.model("resources", ResourceSchema)
    return Resource
}