import { commonAPI } from "./CommonAPI"
import { SERVER_URL } from "./ServerUrl"

  
  // login API
  export const AdminLoginAPI = async (superHero) => {
    return await commonAPI("POST", `${SERVER_URL}AdminRouter/loginSuperHero`,superHero);
  };
  // fetch userGrievances
  export const getAllGrievancesAPI = async () => {
    return await commonAPI("GET", `${SERVER_URL}AdminRouter/getAllGrievances`, "");
  };
  // update Grievances status
  export const updateGrievancesAPI = async (id,reqBody) => {
    return await commonAPI("PUT", `${SERVER_URL}AdminRouter/updateGrievance/${id}`, reqBody);
  };
 