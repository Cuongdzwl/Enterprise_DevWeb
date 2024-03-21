import { useState, useEffect } from 'react';

const useMultipleFetch = (urls) => {
  const [dataList, setDataList] = useState([]);
  const [errorList, setErrorList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responses = await Promise.all(urls.map(url => fetch(url)));
        const jsonDataList = await Promise.all(responses.map(response => response.json()));
        setDataList(jsonDataList);
        setErrorList([]);
      } catch (error) {
        setErrorList(error.message);
      }
    };

    fetchData();
  }, [urls]);

  return { dataList, errorList };
};

export default useMultipleFetch;
