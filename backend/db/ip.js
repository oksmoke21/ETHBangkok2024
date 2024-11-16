import IP from '../models/IP.js';

export const addIPValuation = async (ipValuationData) => {
    try {
        const newIPValuation = new IP(ipValuationData);
        await newIPValuation.save();
        return newIPValuation;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

// Keyword can be formId, ipType, companyNumber, etc.
export const fetchIPValuationByKeyword = async (field, keyword) => {
    try {
        const query = {};
        query[field] = keyword;
        const ipValuation = await IP.find(query);
        return ipValuation;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

export const fetchTokenizedIPValuationByKeyword = async (field, keyword) => {
    try {
        const tokenizedResults = await IP.find({
            [field]: keyword,
            status: "Tokenized"
        });

        const valuedResults = await IP.find({
            [field]: keyword,
            status: "Valued"
        });

        return [...tokenizedResults, ...valuedResults];
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

export const removeIPValuation = async (formId) => {
    try {
        const result = await IP.findOneAndDelete({ formId });
        return result;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

export const updateIPValuation = async (formId, updateData) => {
    try {
        const updatedIPValuation = await IP.findOneAndUpdate({ formId }, updateData, { new: true });
        return updatedIPValuation;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};
