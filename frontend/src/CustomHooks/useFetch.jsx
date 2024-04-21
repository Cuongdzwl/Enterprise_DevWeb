import { useState, useEffect } from 'react';

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortCont = new AbortController();
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(url, {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    signal: abortCont.signal
                });

                if (!response.ok) {
                    throw Error('Could not fetch the data for that resource');
                }

                const data = await response.json();
                setData(data);
                setIsPending(false);
                setError(null);
            } catch (err) {
                if (err.name === 'AbortError') {
                    console.log('Fetch aborted');
                } else {
                    setIsPending(false);
                    setError(err.message);
                }
            }
        };

        fetchData();

        return () => abortCont.abort();
    }, [url]);

    return { data, isPending, error };
};

export default useFetch;
