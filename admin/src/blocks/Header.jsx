import { useNavigate } from "react-router-dom";

import { useUser } from "../context/AuthContext";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export default function Header() {

    const navigate = useNavigate();

    const [user, setUser] = useUser();
    
    async function Logout() {
        const res = await fetch(`${apiBaseURL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!res.ok) {
                const json = await res.json()
                console.log(`Logout Failed: ${json.error}`);
                return;
        }
        setUser({});
        navigate('/');
    }

    return (
        <header className='header'>
            you are logged in as {user.email}
            <button onClick={Logout}>Logout</button>
        </header>
    );
}