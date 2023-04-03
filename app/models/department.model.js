module.exports = mongoose => {
    const DepartmentSchema = mongoose.Schema(
        {
            department_id: Number,
            name: String
        }
    )

    DepartmentSchema.method("toJSON", function() {
        const {__v, _id, ...object} = this.toObject()
        object.id = _id;
        return object
    })

    const Department = mongoose.model("departments", DepartmentSchema)
    return Department
}