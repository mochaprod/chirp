import { useContext } from "react";

import { StorageContext } from "../StorageProvider";
import { UserContext } from "../UserProvider";

const useUser = () => {
    const { token } = useContext(StorageContext);
    const user = useContext(UserContext);

    return {
        token,
        user
    };
};

export default useUser;
