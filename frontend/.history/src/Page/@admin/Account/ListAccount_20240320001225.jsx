import 

const ListAccount = () => {
    const [tableData, setTableData] = useState([]); // State to hold API data

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('your-api-endpoint');
                const data = await response.json();
                setTableData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
                
            }
        };

        fetchData();
    }, []);

    return (
        <div className="box">
            <table>
                <thead>
                    <tr>
                        {Object.entries(tHead).map(([key, value]) => (
                            <th key={key} colSpan="1">
                                {value}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {tableData.length > 0 &&
                        tableData.map((row) => (
                            <tr key={row.id || Math.random()}>
                                <td colSpan="1">{row.name}</td>
                                <td colSpan="1">{row.description}</td>
                                <td colSpan="1" style={{ textAlign: "center" }}>
                                    {row.numberEvent}
                                </td>
                                <td>
                                    <span className="guest-status">{row.guest}</span>
                                </td>
                                <td colSpan="2">
                                    <ul className="menu-action">
                                        <li>
                                            <a href="">
                                                <i className="fa-solid fa-circle-info"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="">
                                                <i className="fa-solid fa-pen-to-square"></i>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="">
                                                <i className="fa-solid fa-trash"></i>
                                            </a>
                                        </li>
                                    </ul>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            {tableData.length === 0 && <p>Loading data...</p>}
        </div>
    );
};

export default ListAccount;
