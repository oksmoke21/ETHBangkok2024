import { addUser, fetchUserByKeyword, updateUser } from '../db/user.js';

/**
 * After every login, this API will be called
 * If fresh login by user, then pop onboarding modal on dashboard
 * If regular login, retrieve existing data and redirect to dashboard
 */
const postLoginFlow = async (req, res) => {
    try {
        let userDetails = {}; // output data that is stored to DB
        let onboarded = false; // flag whether user is a fresh signup for onboarding modal popup
        let isLawyer= false; 
        const userInfo = req.body.userInfo;
        const address = req.body.address;

        const dbUser = await fetchUserByKeyword('address', address);

        if (dbUser) {
            // login
            console.log("Login: ", address)

            // Check if onboarding agreement is present
            if (dbUser.signedAgreements.onboarding && dbUser.signedAgreements.onboarding != "") {
                onboarded = true;
            }
            if(dbUser.isLawyer){
                isLawyer=true;

            }

            userDetails.lastLoginData = userInfo

            // update user in DB
            const updatedUser = await updateUser(address, userDetails);
            console.log("Updated user details")
        } else {
            // fresh signup
            console.log("Signup: ", address)

            userDetails.address = address
            userDetails.email = userInfo.email
            userDetails.name = userInfo.name
            userDetails.profileImage = userInfo.profileImage
            userDetails.lastLoginData = userInfo
            userDetails.country = userInfo.country
            userDetails.signedAgreements = {
                onboarding: null
            }
            userDetails.isNewToBlockchain = userInfo.isNewToBlockchain
            userDetails.isKYC = false
            userDetails.kyc = []

            // store user in DB
            const storedUser = await addUser(userDetails)
            console.log("User signed up to DB")
        }
        res.send({
            onboarded: onboarded,
            isLawyer:isLawyer,
            userDetails: userDetails
        });
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).send(error);
    }
}

const onboardUser = async (req, res) => {
    try {
        let onboarded = false;
        let isLawyer = false;
        const address = req.body.address;
        const payload = req.body.payload;
        const signedOnboardingAgreement = req.body.signedMessage;

        const dbUser = await fetchUserByKeyword('address', address);

        // TODO: Run additional test to make sure that signed message's signer is the address
        // Signature check via ethers utils

        // Saving onboarding agreement to: signedAgreements => onboarding = signedOnboardingAgreement

        if (dbUser.email != payload.email) {
            const error = new Error("Emails do not match")
            res.status(500).send(error);
        }

        dbUser.firstName = payload.firstName;
        dbUser.lastName = payload.lastName;
        dbUser.country = payload.country;
        dbUser.isNewToBlockchain = payload.isNewToBlockchain;
        dbUser.signedAgreements.onboarding = signedOnboardingAgreement;

        dbUser.isLawyer = payload.isLawyer;
        if(payload.isLawyer) {
            dbUser.specialization = payload.specialization;
            dbUser.regionUnderPractice = payload.regionUnderPractice;
            dbUser.practiceType = payload.practiceType;
            dbUser.organizationId = payload.organizationId;
            isLawyer=true;
        }

        onboarded = true;

        // update user in DB
        const updatedUser = await updateUser(address, dbUser);
        console.log("Updated user agreement");

        res.send({
            onboarded: onboarded,
            isLawyer:isLawyer
        });
    } catch (error) {
        console.log("Error: ", error)
        res.status(500).send(error);
    }
}

export {
    postLoginFlow,
    onboardUser,
}
