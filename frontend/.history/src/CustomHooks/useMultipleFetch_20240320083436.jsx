import { useState, useEffect, useMemo } from 'react';

const useMultipleFetch = (urls) => {
    const [dataList, setDataList] = useState([]);
    const [errorList, setErrorList] = useState([]);

    const memoizedUrls = useMemo(() => urls, [urls]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const responses = await Promise.all(memoizedUrls.map(url => fetch(url)));
                const jsonDataList = await Promise.all(responses.map(response => response.json()));
                setDataList(jsonDataList);
                setErrorList([]);
            } catch (error) {
                setErrorList(error.message);
            }
        };

        fetchData();
    }, [memoizedUrls]);

    return { dataList, errorList };
};

export default useMultipleFetch;
