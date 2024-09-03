import { searchList } from "@/api/comnCodMgr/getComnGrpApi";
import { useQuery } from "@tanstack/vue-query";

const useGetComnGrp = (params) => {
    console.log("hook", params);
    return useQuery({
        queryKey: ["listComnGrpsdsds", params],
        queryFn: () => searchList(params)
    });
};

export default useGetComnGrp;
