import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { usePermissions } from "../context/AuthContext";


const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [permissions, setPermissions] = usePermissions();

    async function handleSubmit(event) {
        event.preventDefault();

        const body = {
            email,
            password
        };

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

            setPermissions(json.data.permissions);

            navigate('/dashboard');

        } catch (err) {
            setError("Something went wrong");
            console.error(err);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                    required
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                    required
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
            </div>
            <div className="form-group">
                <button type="submit">Login</button>
            </div>
            {error &&
                <div className="form-error">
                    <p>{error}</p>
                </div>
            }
        </form>
    );
}