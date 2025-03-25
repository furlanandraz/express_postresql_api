import { useNavigate } from "react-router-dom";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
    const navigate = useNavigate();
    
    async function Logout() {
        const res = await fetch(`${apiBaseURL}/admin/logout`, {
            method: 'POST',
            credentials: 'include',
        });
        if (!res.ok) {
                const json = await res.json()
                console.log(`Logout Failed: ${json.error}`);
                return;
            }
        navigate('/');
    }

    return (
        <div>
            <p>dashboard</p>
            <button onClick={Logout}>Logout</button>
        </div>
    );
}