import { useState, useEffect, } from "react";

const apiBaseURL = import.meta.env.VITE_API_BASE_URL;

export function useMenuTree() {
    const [tree, setTree] = useState([]);
    const [item, setItem] = useState({});
    const [languageDefault, setLanguageDefault] = useState('');
    const [languageEnabled, setLanguageEnabled] = useState([]);
    const [loading, setLoading] = useState(false);
    const [changed, setChanged] = useState(false);

    useEffect(() => {
        
        async function getRouteTree() {
           
            setLoading(true);
            try {
                const res = await fetch(`${apiBaseURL}/resource/route-tree/simple`, {
                    credentials: 'include',
                });
                
                const json = await res.json();
                
                setTree(json.data.route_tree);
                setLanguageDefault(json.data.language_default);
                setLanguageEnabled(json.data.language_enabled);
                
            } catch (err) {
                console.error(err);
            } finally {
                setChanged(false);
                setLoading(false);
            }
        }

        getRouteTree();

    }, [changed]);

    function getRouteItem(id) {

        async function f(id) {
           
            try {
                const res = await fetch(`${apiBaseURL}/resource/route-item/${id}?normalize=true`, {
                    method: 'GET',
                    credentials: 'include'
                });
                const json = await res.json();
                setItem(json.data);
                
            } catch (err) {
                console.log(err.code);
            } finally {
                setChanged(true);
            }
        }

        f(id);
    }

    function moveRouteItem(item) {

        async function f(item) {
           
            try {
                await fetch(`${apiBaseURL}/navigation/route`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                });
                
            } catch (err) {
                console.log(err.code);
            } finally {
                setChanged(true);
            }
        }

        f(item);
    }

    function updateRouteItem(item) {

        async function f(item) {
           
            try {
                await fetch(`${apiBaseURL}/resource/route-item`, {
                    method: 'PUT',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                });
                
            } catch (err) {
                console.log(err.code);
            } finally {
                setChanged(true);
            }
        }

        f(item);
    }

    function createRouteItem(item) {
        

        async function f(item) {
           
            try {
                await fetch(`${apiBaseURL}/resource/route-item`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(item)
                });
                
            } catch (err) {
                console.log(err.code);
            } finally {
                setChanged(true);
            }
        }

        f(item);
    }

    function deleteRouteItem(id) {

        async function f(id) {
           
            try {
                await fetch(`${apiBaseURL}/navigation/route/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                
            } catch (err) {
                console.log(err.code);
            } finally {
                setChanged(true);
            }
        }

        f(id);
    }

    return { tree, item, setItem, languageDefault, languageEnabled, moveRouteItem, getRouteItem, updateRouteItem, createRouteItem, deleteRouteItem, loading };
}