import { fetchDueDiligenceByKeyword, fetchCompletedDueDiligenceByKeyword, removeDueDiligence, updateDueDiligence } from '../db/dueDiligence.js';

export const getDueDiligence = async (req, res) => {
    try {
        const ipNumber = req.query.ipNumber;
        console.log("ipNumber: ", ipNumber)
        // TODO: Get address of requester, ensure it's owner or approved IP Lawyer (assigned for valuation)
        const forms = await fetchDueDiligenceByKeyword('ipNumber', ipNumber);
        res.send(forms);
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).send(error);
    }
}