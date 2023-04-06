import { useState, useEffect } from "react";

const useAuth = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

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

                if (response.ok) {
                    setAuthenticated(true);
                    setLoading(false);
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

    return { authenticated, loading };
};

export default useAuth;
