const mongoose = require('mongoose');

const PdfDetailsSchema = new mongoose.Schema({
    title: String,
    pdf: String,
    text: String,
});

const PdfDetails = mongoose.model('PdfDetails', PdfDetailsSchema);

module.exports = PdfDetails;
