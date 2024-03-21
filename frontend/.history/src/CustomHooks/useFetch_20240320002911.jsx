import { useState, useEffect } from 'react';

const useFetch = (url, method = 'GET', options = {}) => {
    const [data, setData] = useState(null);
    const [isPending, setIsPending] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortCont = new AbortController();

        const fetchData = async () => {
            setIsPending(true);
            setError(null);

            try {
                const response = await fetch(url, {
                    method,
                    signal: abortCont.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        ...options.headers,
                    },
                    body: JSON.stringify(options.body) || undefined,
                });

                if (!response.ok) {
                    throw new Error(`Could not fetch data: ${response.status}`);
                }

                const fetchedData = await response.json();
                setData(fetchedData);
            } catch (err) {
                if (err.name === 'AbortError') {
                    console.log('fetch aborted');
                } else {
                    setError(err.message);
                }
            } finally {
                setIsPending(false);
            }
        };

        fetchData();

        
        return () => abortCont.abort();
    }, [url, method, options]);

    return { data, isPending, error };
};

export default useFetch;
