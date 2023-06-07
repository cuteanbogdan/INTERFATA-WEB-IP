import { useState, useEffect } from "react";

const useAuthRoles = (allowedRoles) => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState("");

    useEffect(() => {
        const verifyToken = async () => {
            const token = localStorage.getItem("token");
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await fetch("http://localhost:5000/api/verifytoken", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();
                const userRoleAfterVerify = data.data.rol;
                setUserRole(userRoleAfterVerify);

                if (response.ok && allowedRoles.includes(userRoleAfterVerify)) {
                    setAuthenticated(true);
                    setLoading(false);
                } else {
                    localStorage.removeItem("token");
                    setLoading(false);
                }
            } catch (error) {
                console.error(error);
                localStorage.removeItem("token");
                setLoading(false);
            }
        };

        verifyToken();
    }, [allowedRoles]);

    return { authenticated, loading, userRole };
};

export default useAuthRoles;
