import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useAuth = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [userRole, setUserRole] = useState("")

    const history = useNavigate();
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
                console.log(data)
                const userRoleAfterVerify = data.data.rol
                setUserRole(userRoleAfterVerify)
                if (response.ok) {
                    setAuthenticated(true);
                    setLoading(false);
                    switch (userRoleAfterVerify) {
                        case "Administrator": history("/administrator")
                            break;
                        case "Doctor": history("/doctor")
                            break;
                        case "Pacient": history(`/pacient/${data.data.id_pacient}`)
                            break;
                        case "Ingrijitor": history("/ingrijitor")
                            break;
                        case "Supraveghetor": history("/supraveghetor")
                            break;
                        default: console.log("No role")
                    }
                } else {
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error(error);
                localStorage.removeItem("token");
            }

            setLoading(false);
        };

        verifyToken();
    }, []);

    return { authenticated, loading, userRole };
};

export default useAuth;
