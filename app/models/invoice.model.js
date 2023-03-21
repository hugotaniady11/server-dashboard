module.exports = mongoose => {
    const InvoiceSchema = mongoose.Schema(
        {
            invoice_number: Number,
            date: Date,
            client_name: String,
            invoice_amount: Number,
            project: { type: mongoose.Schema.Types.ObjectId, ref: "projects" }
        }
    )

    InvoiceSchema.method("toJSON", function () {
        const { __v, _id, ...object } = this.toObject()
        object.id = _id;
        return object
    })

    const Invoice = mongoose.model("invoices", InvoiceSchema)
    return Invoice
}