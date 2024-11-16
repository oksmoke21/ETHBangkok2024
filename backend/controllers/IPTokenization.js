import { addIPValuation, fetchTokenizedIPValuationByKeyword, removeIPValuation, updateIPValuation } from '../db/ip.js';

const getMyIPs = async (req, res) => {
    try {
        const address = req.query.address;

        const forms = await fetchTokenizedIPValuationByKeyword('address', address);
        res.send(forms);
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).send(error);
    }
}

export {
    getMyIPs
}