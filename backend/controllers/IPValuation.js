import { addIPValuation, fetchIPValuationByKeyword, removeIPValuation, updateIPValuation } from '../db/ip.js';

const submitFormDB = async (req, res) => {
    try {
        let dbSubmitData = {}; // data submitted during db call
        let responseData = {}; // data returned as API response

        const address = req.body.address;
        const formData = req.body.formData;
        const formId = formData.formId;

        console.log(`FormId: ${formId}`);
        console.log("FormData: ", formData);
        console.log(`Address: ${address}`);
        
        const dbForm = await fetchIPValuationByKeyword('formId', formId);

        if (dbForm && dbForm.length > 0) {
            if (dbForm.address != address) {
                throw Error("How can address of form creator not match address?")
            }
            // update existing form
            const updatedForm = await updateIPValuation(formId, formData);
            responseData = updatedForm;
            console.log("Updated IP valuation form");
        } else {
            // fresh form
            
            dbSubmitData = formData;
            dbSubmitData.address = address;

            const storedForm = await addIPValuation(dbSubmitData);
            responseData = storedForm; // ?
            console.log("Created IP valuation form");
        }
        res.status(201).send();
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).send(error);
    }
}

const updateIPStatus = async (req, res) => {
    try {
        const address = req.body.address;
        const formId = req.body.formId;
        const updatedStatus = req.body.updatedStatus;

        console.log(`FormId: ${formId}`);
        console.log("UpdatedStatus: ", updatedStatus);
        console.log(`Address: ${address}`);
        
        const dbForm = await fetchIPValuationByKeyword('formId', formId);

        if (dbForm && dbForm.length > 0) {
            await updateIPValuation(formId, {status: updatedStatus});
            console.log("Updated IP valuation form's status");
        }
        res.status(201).send();
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).send(error);
    }
}

const getAllForms = async (req, res) => {
    try {
        const address = req.query.address;
        const forms = await fetchIPValuationByKeyword('address', address);
        res.send(forms);
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).send(error);
    }
}

const getFormById = async (req, res) => {
    try {
        const formId = req.query.formId;
        const form = await fetchIPValuationByKeyword('formId', formId);
        res.send({
            form: form
        });
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).send(error);
    }
}

export {
    getAllForms,
    getFormById,
    updateIPStatus,
    submitFormDB,
}