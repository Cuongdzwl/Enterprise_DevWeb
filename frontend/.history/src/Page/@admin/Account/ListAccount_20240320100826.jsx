import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

const headings = ['Full Name', 'Email', 'Faculty', 'Role', 'Action'];

const ListAccount = () => {
    const { data, error } = useFetch('http://localhost:3000/account', { method: 'GET' });

    if (error) {
        return <p>Error fetching data: {error.message}</p>;
    }
    if (!data) {
        return (
            <div className="box">
                <table>
                    <thead>
                        <TableHead headings={headings} />
                    </thead>
                    <tbody>
                        <tr>
                            {headings.map((heading, index) => (
                                <td key={index}>
                                    <Skeleton />
                                </td>
                            ))}
                        </tr>
                        {[...Array(10)].map((_, index) => (
                            <tr key={index}>
                                {headings.map((_, index) => (
                                    <td key={index}>
                                        <Skeleton />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="box">
            <table>
                <thead>
                    <TableHead headings={headings} />
                </thead>
                <tbody>
                    {data.map((row, index) => (
                        <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.email}</td>
                            <td>{row.faculty}</td>
                            <td>{row.role}</td>
                            
                            <td colSpan="2">
                                <ul className="menu-action">
                                    <li>
                                        <Link to={`/account/${row.id}`}>
                                            <i className="fa-solid fa-circle-info"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={`/account/update/${row.id}`}>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={`/account/delete/${row.id}`}>
                                            <i className="fa-solid fa-trash"></i>
                                        </Link>
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
