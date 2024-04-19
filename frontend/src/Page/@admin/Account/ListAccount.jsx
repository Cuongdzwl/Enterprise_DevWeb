import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Search from '../../../components/Search';
import { Link, useNavigate } from 'react-router-dom';
import { ApiResponse } from '../../../Api';
import Loading from '../../../components/Loading';

const headings = ['Full Name', 'Email', 'Faculty', 'Role', 'Action'];

const ListAccount = () => {
    const navigate = useNavigate();
    const { data: accountData } = useFetch(`${ApiResponse}users/?depth=1`);
    const [error, setError] = useState(null);
    const [accounts, setAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (accountData) {
            setAccounts(accountData);
        }
    }, [accountData]);

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${ApiResponse}users/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
                return;
            }
            setAccounts(prevAccounts => prevAccounts.filter(account => account.ID !== id));
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleCreate = () => navigate('/admin/account/create');

    const filteredAccounts = accounts.filter(account =>
        account.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        account.Email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Account</div>
                </div>
                <Search placeholder={'Search Account'} value={searchTerm} onChange={handleSearchChange} />
                <div className="create">
                    <button className="custom-button" onClick={handleCreate}>Create</button>
                </div>
            </div>
            <div className="row-2 list">
                <div className="box">
                    <table>
                        <thead>
                            <TableHead headings={headings} />
                        </thead>
                        <tbody>
                            {filteredAccounts.length > 0 ? (
                                filteredAccounts.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.Name}</td>
                                        <td>{row.Email}</td>
                                        <td>{(row.Faculty?.Name)}</td>
                                        <td>{row.Role?.Name}</td>
                                        <td colSpan="2">
                                            <ul className="menu-action">
                                                <li><Link to={`detail/${row.ID}`}><i className="fa-solid fa-circle-info"></i></Link></li>
                                                <li><Link to={`update/${row.ID}`}><i className="fa-solid fa-pen-to-square"></i></Link></li>
                                                <li><Link to='#' onClick={() => handleDelete(row.ID)}><i className="fa-solid fa-trash"></i></Link></li>
                                            </ul>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headings.length}>Not Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    {error && <div className="error">{error}</div>}
                </div>
            </div>
        </div>
    );
};

export default ListAccount;
