import User from '../models/User.js';

export const addUser = async (userData) => {
    try {
        const newUser = new User(userData);
        await newUser.save();
        return newUser;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

// Keyword can be address, email, firstName, lastName, etc
export const fetchUserByKeyword = async (field, keyword) => {
    try {
        const query = {};
        query[field] = keyword;
        const user = await User.findOne(query);
        return user;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

export const fetchAllLawyers = async (field, keyword) => {
    try {
        const query = {};
        query["isLawyer"] = true;
        const user = await User.findOne(query);
        return user;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

// Keyword can be patent, copyright, trademark
export const fetchLawyersBySpecialization = async (keyword) => {
    try {
        const query = {};
        query["specialization"] = keyword;
        query["isLawyer"] = true;
        const user = await User.findOne(query);
        return user;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

export const removeUser = async (address) => {
    try {
        const result = await User.findOneAndDelete({ address });
        return result;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};

export const updateUser = async (address, updateData) => {
    try {
        const updatedUser = await User.findOneAndUpdate({ address }, updateData, { new: true });
        return updatedUser;
    } catch (error) {
        console.log("dbError: ", error);
        throw error;
    }
};
