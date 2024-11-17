import { fetchAllLawyers, fetchLawyersBySpecialization } from '../db/user.js';

export const getAllLawyers = async (req, res) => {
    try {
        const lawyers = await fetchAllLawyers();
        res.send(lawyers);
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).send(error);
    }
}

export const getLawyersBySpecialization = async (req, res) => {
    try {
        const specialization = req.body.specialization;
        const lawyers = await fetchLawyersBySpecialization(specialization);
        res.send(lawyers);
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).send(error);
    }
}