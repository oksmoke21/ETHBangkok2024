import mongoose from 'mongoose';

const ValuationSchema = new mongoose.Schema({
    formId: {
        type: String,
        required: true,
    },
    ipNumber: {
        type: String,
        required: true,
    },
    companyNumber: {
        type: String,
        required: true,
    },
    ownerId: {
        type: String,
        required: true,
    },
    startDate: {
        type: String,
        required: true,
    },
    endDate: {
        type: String,
        required: true,
    },
    assignedLawyers: [
        {
            type: String,
            required: true,
        }
    ],
    reports: [
        {
            lawyerId: {
                type: String,
                required: true,
            },
            maxValue: {
                type: Number,
                required: true,
            },
            minValue: {
                type: Number,
                required: true,
            },
            maxLoan: {
                type: Number,
                required: true,
            },
            riskScore: {
                type: String,
                required: true,
            },
            reportLink: {
                type: String,
                required: false,
            },
        }
    ],
});

const Valuation = mongoose.model('Valuation', ValuationSchema);
export default Valuation;
