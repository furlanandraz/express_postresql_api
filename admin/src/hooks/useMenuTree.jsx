import { useState, useEffect } from "react";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export function useMenuTree() {
    const [tree, setTree] = useState([]);
    const [treeLatent, setTreeLatent] = useState([]);
    const [commit, setCommit] = useState(0);
    const [loading, setLoading] = useState(false);
    

    useEffect(() => {
        
        async function getMenuTree() {
            setLoading(true);
            try {
                const res = await fetch(`${apiBaseURL}/navigation/get-menu-tree`, {
                    credentials: 'include',
                });
                
                const data = await res.json();

                setTree(data);
                setTreeLatent(data);
                setLoading(false);

            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }

        getMenuTree()

    }, [commit]);

    async function commitMenuTree() {
        try {
            const res = await fetch(`${apiBaseURL}/navigation/update-menu-items`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(latentTree),
            });

            if (!res.ok) throw new Error("Failed to save");
            return true;
            
        } catch (err) {
            console.error("Commit failed:", err);
            return false;
        } finally {
            setCommit(Date.now());
        }
        
    }

    function discardChanges() {
        if (JSON.stringify(treeLatent) !== JSON.stringify(tree)) {
            setTreeLatent(tree);
        }
    }

    return {treeLatent, setTreeLatent, loading, commitMenuTree, discardChanges};
}