
import useFetch from '../../../CustomHooks/useFetch';

const tHead = {
    name: 'Name',
    description: 'Description',
    numberEvent: 'Number of Event',
    guest: 'Guest',
    action: 'Action'
}

const ListAccount = () => {
    const [tableData, setTableData] = useState([]);

    const {data, isPending, error} = useFetch('http://localhost:8000/accounts');

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
