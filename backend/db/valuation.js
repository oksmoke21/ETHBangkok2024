// TODO

import Valuation from '../models/Valuation.js';

export const addValuation = async (valuationData) => {
    try {
        const newValuation = new Valuation(valuationData);
        await newValuation.save();
        return newValuation;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

// Keyword can be ipNumber, valuationId, etc
export const fetchValuationByKeyword = async (field, keyword) => {
    try {
        const query = {};
        query[field] = keyword;
        const valuation = await Valuation.findOne(query);
        return valuation;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

export const updateValuation = async (address, updateData) => {
    try {
        const updatedValuation = await Valuation.findOneAndUpdate({ address }, updateData, { new: true });
        return updatedValuation;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};
