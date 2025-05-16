import { useState } from "react";
// import { useNavigate, Navigate } from "react-router-dom";

// import { useUser } from "../context/AuthContext";
import { useLogin } from "../../hooks/useLogin";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const { login, loading, error } = useLogin();

    async function handleSubmit(event) {
        event.preventDefault();

        const body = {
            email,
            password
        };

        await login(body);

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