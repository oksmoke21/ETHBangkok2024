// TODO

// import Lawyer from '../models/Lawyer.js';

// export const addLawyer = async (lawyerData) => {
//     try {
//         const newLawyer = new Lawyer(lawyerData);
//         await newLawyer.save();
//         return newLawyer;
//     } catch (error) {
//         console.log("dbError: ", error);
//         throw error;
//     }
// };

// // Keyword can be address, email, firstName, lastName, etc
// export const fetchLawyerByKeyword = async (field, keyword) => {
//     try {
//         const query = {};
//         query[field] = keyword;
//         const lawyer = await Lawyer.findOne(query);
//         return lawyer;
//     } catch (error) {
//         console.log("dbError: ", error);
//         throw error;
//     }
// };

// export const removeLawyer = async (address) => {
//     try {
//         const result = await Lawyer.findOneAndDelete({ address });
//         return result;
//     } catch (error) {
//         console.log("dbError: ", error);
//         throw error;
//     }
// };

// export const updateLawyer = async (address, updateData) => {
//     try {
//         const updatedLawyer = await Lawyer.findOneAndUpdate({ address }, updateData, { new: true });
//         return updatedLawyer;
//     } catch (error) {
//         console.log("dbError: ", error);
//         throw error;
//     }
// };
