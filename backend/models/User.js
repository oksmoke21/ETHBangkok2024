import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    address: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    profileImage: {
        type: String,
        required: false,
    },
    lastLoginData: {
        type: Object,
        required: true,
    },
    country: {
        type: String,
        required: false,
    },
    signedAgreements: {
        type: Object,
        required: true,
    },
    isNewToBlockchain: {
        type: Boolean,
        required: false,
    },
    isKYC: {
        type: Boolean,
        required: true,
    },
    kyc: {
        type: Object,
        required: false,
    },
    isLawyer: {
        type: Boolean,
        required: true,
        default: false,
    },
    practiceType: {
        type: String,
        enum: ['Solo', 'Organization'],
        required: false,
    },
    organizationId: {
        type: String,
        required: false,
    },
    lawyerDescription: {
        type: String,
        // required: function() { return this.isLawyer; },
        required: false,
    },
    specialization: {
        type: String,
        required: false,
    },
    consultationFees: {
        type: Number,
        required: false,
    },
    regionUnderPractice: {
        type: String,
        required: false,
    },
    consultationDetails: {
        type: String,
        required: false,
    },
    valuationIds: {
        type: [String],
        required: false,
    },
});

const User = mongoose.model('User', UserSchema);
export default User;
