import { useState, useEffect, useMemo } from 'react';

const useMultipleFetch = (urls) => {
    const [dataList, setDataList] = useState([]);
    const [errorList, setErrorList] = useState([]);
    const [isLoading, setIsLoading] = useState(false); // Add loading state

    const memoizedUrls = useMemo(() => urls, [urls]);

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true); // Set loading state to true
            try {
                const responses = await Promise.all(memoizedUrls.map(url => fetch(url)));
                const jsonDataList = await Promise.all(responses.map(response => response.json()));
                setDataList(jsonDataList);
                setErrorList([]);
            } catch (error) {
                setErrorList(error.message); // Handle specific errors if needed
            } finally {
                setIsLoading(false); // Set loading state to false regardless of success or failure
            }
        };

        fetchData();
    }, [memoizedUrls]);

    return { dataList, errorList, isLoading }; // Return loading state as well
};

export default useMultipleFetch;
