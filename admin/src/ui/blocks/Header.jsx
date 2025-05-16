import { useNavigate } from "react-router-dom";

import { useUser } from "../../context/AuthContext";

import styles from './Header.module.css'

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
        <header className={styles.header}>
            <div className={styles.right}>
                <span className={styles.userData}>
                    you are logged in as <b>{user.email}</b>
                </span>
                <span className={styles.actions}>
                    <button onClick={Logout}>Logout</button>
                </span>
            </div>
        </header>
    );
}