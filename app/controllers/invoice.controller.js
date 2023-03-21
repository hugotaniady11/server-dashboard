const db = require('../models')
const Invoice = db.invoices
const Project = db.projects

exports.createInvoice = async (req, res) => {
    try {
        const { invoice_number, date, client_name, invoice_amount, project } = req.body;

        const existingInvoice = await Invoice.findOne({
            invoice_number
        })

        if (existingInvoice) {
            return res.status(400).json({
                message: "Invoice has been made"
            })
        }

        // Check if the provided project ID exists
        const existingProject = await Project.findById(project);
        if (!existingProject) {
            return res.status(400).json({ message: "Project does not exist" });
        }

        // Create a new invoice object
        const newInvoice = new Invoice({
            invoice_number,
            date,
            client_name,
            invoice_amount,
            project: existingProject._id
        });

        // Save the new invoice to the database
        const savedInvoice = await newInvoice.save();

        // Populate the project data and return the saved invoice with project data
        const populatedInvoice = await Invoice.findById(savedInvoice._id).populate("project");

        res.status(201).json(populatedInvoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }

}

exports.getInvoices = async (req, res) => {
    try {
        const invoices = await Invoice.find().populate("project");
        res.status(200).json(invoices);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }

}

exports.getInvoiceById = async (req, res) => {
    try {
        const invoice = await Invoice.findOne({ invoice_number: req.params.invoice_number }).populate("project");

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        res.status(200).json(invoice);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.updateInvoiceById = async (req, res) => {
    try {
        const { invoice_number, date, client_name, invoice_amount, project } = req.body;

        const invoice = await Invoice.findOne({ invoice_number: req.params.invoice_number });

        if (!invoice) {
            return res.status(404).json({ message: "Invoice not found" });
        }

        invoice.invoice_number = invoice_number || invoice.invoice_number;
        invoice.date = date || invoice.date;
        invoice.client_name = client_name || invoice.client_name;
        invoice.invoice_amount = invoice_amount || invoice.invoice_amount;
        invoice.project = project || invoice.project;

        await invoice.save();

        res.status(200).json({ message: "Invoice updated successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}

exports.deleteInvoiceById = async (req, res) => {
    const invoiceNumber = req.params.invoice_number;
    try {
        const invoice = await Invoice.findOneAndDelete({ invoice_number: invoiceNumber });

        if (!invoice) {
            return res.status(404).json({ message: `Invoice with number ${invoiceNumber} not found` });
        }

        res.status(200).json({ message: "Invoice deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server Error" });
    }
}