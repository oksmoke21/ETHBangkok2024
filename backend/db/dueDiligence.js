import DueDiligence from '../models/DueDiligence.js';

// Keyword can be formId, ipNumber, companyNumber, etc.
export const fetchDueDiligenceByKeyword = async (field, keyword) => {
    try {
        const query = {};
        query[field] = keyword;
        const dueDiligence = await DueDiligence.find(query);
        return dueDiligence;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

export const fetchCompletedDueDiligenceByKeyword = async (field, keyword) => {
    try {
        const query = {};
        query[field] = keyword;
        query['additionalDetails.legalStatus'] = "Completed";
        const dueDiligence = await DueDiligence.find(query);
        return dueDiligence;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

export const addDueDiligence = async (dueDiligenceData) => {
    try {
        const newDueDiligence = new DueDiligence(dueDiligenceData);
        await newDueDiligence.save();
        console.log("DueDiligence data saved:", newDueDiligence); 
        return newDueDiligence;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

export const removeDueDiligence = async (formId) => {
    try {
        const result = await DueDiligence.findOneAndDelete({ formId });
        return result;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

export const updateDueDiligence = async (formId, updateData) => {
    try {
        const updatedDueDiligence = await DueDiligence.findOneAndUpdate({ formId }, updateData, { new: true });
        return updatedDueDiligence;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};
