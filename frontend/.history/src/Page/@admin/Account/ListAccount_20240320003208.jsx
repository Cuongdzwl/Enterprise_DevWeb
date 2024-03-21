import useFetch from '../../../CustomHooks/useFetch';

const tHead = {
    name: "Name",
    description: "Description",
    numberEvent: "Number Event",
    guest: "Guest",
    action: "Action",
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
                <thead>
                    <tr>
                        {Object.entries(tHead).map(([key, value]) => (
                            <th key={key} colSpan="1">
                                {value}
                            </th>
                        ))}
                    </tr>
                </thead>
                {console.log(data)}
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            <td colSpan="1">{row.Name}</td>
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
        </div>
    );
};

export default ListAccount;
