module.exports = (app) => {
    const invoices = require('../controllers/invoice.controller')
    const router = require('express').Router()


    router.get('/', invoices.getInvoices)
    router.get('/:invoice_number', invoices.getInvoiceById)
    router.put('/:invoice_number', invoices.updateInvoiceById)
    router.delete('/:invoice_number', invoices.deleteInvoiceById)
    router.post('/', invoices.createInvoice)


    app.use('/api/invoices', router)
}