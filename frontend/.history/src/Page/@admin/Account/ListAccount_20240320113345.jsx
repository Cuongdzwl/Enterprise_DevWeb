import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import { useState } from 'react';

const headings = ['Full Name', 'Email', 'Faculty', 'Role', 'Action'];

const ListAccount = () => {
    const { data: account, error } = useFetch('http://localhost:3000/account', { method: 'GET' });
    const { data: roleData } = useFetch('http://localhost:3000/role', { method: 'GET' });
    const { data: facultyData } = useFetch('http://localhost:3000/faculty', { method: 'GET' });

    const [accounts, setAccounts] = useState({})

    if (error) {
        return <p>Error fetching data: {error.message}</p>;
    }
    if (!accounts || !roleData || !facultyData) {
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

    const roleMap = {};
    roleData.forEach(role => {
        roleMap[role.id] = role.name;
    });

    const facultyMap = {};
    facultyData.forEach(faculty => {
        facultyMap[faculty.id] = faculty.name;
    });

    const deleteAccount = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/account/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('Failed to delete account');
            }
            // Xóa tài khoản khỏi danh sách sau khi xóa thành công
            refetch(); // Gọi lại API để cập nhật danh sách
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <div className="box">
            <table>
                <thead>
                    <TableHead headings={headings} />
                </thead>
                <tbody>
                    {account.map((row, index) => (
                        <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.email}</td>
                            <td>{facultyMap[row.faculty]}</td>
                            <td>{roleMap[row.role]}</td>

                            <td colSpan="2">
                                <ul className="menu-action">
                                    <li>
                                        <Link to={`detail/${row.id}`}>
                                            <i className="fa-solid fa-circle-info"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={`update/${row.id}`}>
                                            <i className="fa-solid fa-pen-to-square"></i>
                                        </Link>
                                    </li>
                                    <li>
                                        {/* <Link to={`/delete/${row.id}`}>
                                            <i className="fa-solid fa-trash"></i>
                                        </Link> */}
                                        <button onClick={() => deleteAccount(row.id)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
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
