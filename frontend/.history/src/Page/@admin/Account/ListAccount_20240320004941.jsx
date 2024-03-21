import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';

const headings = ["Name", "Description", "Number Event", "Guest", "Action"];

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
                    <TableHead headings={headings} />
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            <td>{row.Name}</td>
                            <td className="description"
                                style={
                                    {
                                        maxWidth: "208.78px",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                        whiteSpace: "nowrap"
                                    }}>{row.Content}</td>
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
