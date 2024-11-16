import { addUser, fetchUserByKeyword, updateUser } from '../db/user.js';

/**
 * After every login, this API will be called
 * If fresh login by user, then pop onboarding modal on dashboard
 * If regular login, retrieve existing data and redirect to dashboard
 */
const postLoginFlow = async (req, res) => {
    try {
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).send(error);
    }
}

const onboardUser = async (req, res) => {
    try {
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).send(error);
    }
}

export {
    postLoginFlow,
    onboardUser,
}
