import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useUser } from "../context/AuthContext";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export function useLogin() {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useUser();
    
    const navigate = useNavigate();

    async function login(body) {
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`${apiBaseURL}/auth/login`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            const json = await res.json()

            if (!res.ok) {
                setError(`Login Failed: ${json.error}`);
                return;
            }

            setUser(json.data.user);

            navigate('/dashboard');

        } catch (err) {
            setError("Something went wrong");
            
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    return { login, loading, error };
}