import mongoose from 'mongoose';

const IPSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    formId: {
        type: String,
        required: true,
    },
    ipNumber: {
        type: String,
        required: true,
    },
    ipType: {
        type: String,
        required: true,
    },
    ipName: {
        type: String,
        required: false,
    },
    ipDescription: {
        type: String,
        required: false,
    },
    companyNumber: {
        type: String,
        required: true,
    },
    companyName: {
        type: String,
        required: false,
    },
    numberOfCountriesServiced: {
        type: Number,
        required: false,
    },
    registeredRegions: {
        type: [String],
        enum: ['Europe', 'Africa', 'China'],
        required: false,
    },
    registrationStatus: {
        type: String,
        enum: ['Registered', 'Unregistered', 'Pending', 'Expired'],
        required: false,
    },
    registrationDate: {
        type: Date,
        required: false,
    },
    status: {
        type: String,
        enum: ['Draft', 'Unprocessed', 'Rejected', 'Valuing', 'Valued', 'Tokenized, Sold, Loaned, Forfeit'],
        required: true,
    },
    // Draft => complete form
    // Unprocessed => pay valuation fee
    // Rejected => revaluate
    // Valuing => view details
    // Valued => tokenize / revaluate
    // Tokenized => marketplace
    // Sold => view current owner
    // Loaned => view loan details
    // Forfeit => view current owner & status [loan seizure]
    nftTokenId: {
        type: Number,
        required: true, // default: 0
    },
});

const IP = mongoose.model('IP', IPSchema);
export default IP;
