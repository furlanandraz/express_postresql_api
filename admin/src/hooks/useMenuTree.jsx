import { useState, useEffect, } from "react";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export function useMenuTree() {
    const [tree, setTree] = useState([]);
    const [treeLatent, setTreeLatentPreprocess] = useState([]);
    const [commit, setCommit] = useState(0);
    const [loading, setLoading] = useState(false);
    const [changed, setChanged] = useState(false);
    

    function setTreeLatent(treeLatent) {
        const processedTree = addSiblingKeys(treeLatent);
        setTreeLatentPreprocess(processedTree);
    }

    function addSiblingKeys(nodes) {
        return nodes.map((node, _, siblings) => {
            const updatedChildren = node.children
                ? addSiblingKeys(node.children)
                : [];

            const isLeaf = updatedChildren.length === 0;
            const hasSiblings = siblings.length > 1 || isLeaf;

            return {
                ...node,
                hasSiblings,
                children: updatedChildren
            };
        });
    }



    useEffect(() => {
        
        async function getRouteTree() {
           
            setLoading(true);
            try {
                const res = await fetch(`${apiBaseURL}/navigation/get-route-tree`, {
                    credentials: 'include',
                });
                
                const data = await res.json();

                setTree(data);
                setTreeLatent(data);
                setChanged(false);
                setLoading(false);
                

            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        }

        getRouteTree();

    }, [commit]);

    function insertRouteItem(parentId) {
        const newItem = {
            id: 'created_' + Date.now(),
            parent_id: parentId,
            title: 'New Page',
            url_name: 'new-page',
            meta_description: '',
            meta_keywords: '',
            children: []
        }

        function insertItemRecursive(nodes, parentId, newItem) {
            return nodes.map(node => {
                if (node.id === parentId) {
                    return {
                        ...node,
                        children: [...node.children, newItem]
                    };
                }

                if (node.children && node.children.length > 0) {
                    return {
                        ...node,
                        children: insertItemRecursive(node.children, parentId, newItem)
                    };
                }

                return node;
            });
        }

        const updatedTree = insertItemRecursive(treeLatent, parentId, newItem);
        setTreeLatent(updatedTree);
        setChanged(true);
    }

    function deleteRouteItem(id) {
    function deleteRouteItemRecursive(id, nodes) {
        return nodes
            .map(node => {
                if (node.children && node.children.length > 0) {
                    return {
                        ...node,
                        children: deleteRouteItemRecursive(id, node.children)
                    };
                }
                return node;
            })
            .filter(node => node.id !== id);
    }

    const updatedTree = deleteRouteItemRecursive(id, treeLatent);
    setTreeLatent(updatedTree);
    setChanged(true);
}

        
    async function commitMenuTree() {

        
        try {
            const res = await fetch(`${apiBaseURL}/navigation/update-route-items`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ treeLatent: treeLatent, tree: tree }),
            });

            if (!res.ok) throw new Error("Failed to save");
            return true;
            
        } catch (err) {
            console.error("Commit failed:", err);
            return false;
        } finally {
            setChanged(false);
            setCommit(Date.now());
        }
        
    }

    function discardChanges() {
        if (JSON.stringify(treeLatent) !== JSON.stringify(tree)) {
            setChanged(false);
            setTreeLatent(tree);
        }
    }

    function forceRefresh() {
        setCommit(Date.now());
    }

    

    return {treeLatent, setTreeLatent, changed, setChanged, loading, insertRouteItem, deleteRouteItem, commitMenuTree, discardChanges, forceRefresh};
}