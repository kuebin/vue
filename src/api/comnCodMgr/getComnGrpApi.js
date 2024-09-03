import axios from "axios";
import { ComnCodMgr } from "../api";

export const searchList = async (param) => {
    console.log("api", param);
    const result = await axios.post(ComnCodMgr.getComnCodList, param);
    return result.data;
};
