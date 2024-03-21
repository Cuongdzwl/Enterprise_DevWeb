import useFetch from '../../../CustomHooks/useFetch';


const tHead = {
    name: "Name",
    description: "Description",
    numberEvent: "Number Event",
    guest: "Guest",
    action: "Action",
};

const renderTableHead = () => {
    return (
        <tr>
            {Object.values(tHead).map((value, index) => (
                <th key={index}>{value}</th>
            ))}
        </tr>
    );
};

const ListAccount = () => {
    const { data, isPending, error } = useFetch('http://localhost:3000/account');

    if (isPending) {
        return <p>Loading data...</p>;
    }

    if (error) {
        return <p>Error fetching data: {error.message}</p>;
    }

    if (!Array.isArray(data)) {
        return <p>Unexpected data format received.</p>;
    }

    return (
        <div className="box">
            <table>
                <thead>{renderTableHead()}</thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            <td>{row.Name}</td>
                            <td className="description">{row.Content}</td>
                            <td className="number-event">{row.Number}</td>
                            <td>
                                <span className={`guest-status ${row.Status === "Yes" ? "active" : ""}`}>{row.Status}</span>
                            </td>
                            <td colSpan="2">
                                <ul className="menu-action">
                                    <li><a href=""><i className="fa-solid fa-circle-info"></i></a></li>
                                    <li><a href=""><i className="fa-solid fa-pen-to-square"></i></a></li>
                                    <li><a href=""><i className="fa-solid fa-trash"></i></a></li>
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListAccount;
