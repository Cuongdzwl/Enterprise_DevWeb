import React, { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';

const headings = ['Full Name', 'Email', 'Faculty', 'Role', 'Action'];

const ListAccount = ({ searchTerm }) => {
    const { data: accountData, error } = useFetch('http://localhost:3000/account', { method: 'GET' });
    const { data: roleData } = useFetch('http://localhost:3000/role', { method: 'GET' });
    const { data: facultyData } = useFetch('http://localhost:3000/faculty', { method: 'GET' });

    const [accounts, setAccounts] = useState([]);

    useEffect(() => {
        if (accountData) {
            setAccounts(accountData);
        }
    }, [accountData]);

    if (error) {
        return <p>Error fetching data: {error.message}</p>;
    }
    if (!accounts || !roleData || !facultyData) {
        return (
            <div className="box">
                <div className="row-1">
                    <div className="header">
                        <div className="title">List Account</div>
                    </div>
                </div>
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

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/account/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }
            setAccounts(prevAccounts => prevAccounts.filter(account => account.id !== id));
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Account</div>
                </div>
                <div className="search">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input
                        type="text"
                        className="custom-input"
                        placeholder="Search Account"
                        value={searchTerm}
                        onChange={(event) => handleSearchChange(event.target.value)}
                    />
                </div>
                <div className="create">
                    <button className="custom-button" onClick={() => navigate('/admin/account/create')}>Create</button>
                </div>
            </div>

            <div className="row-2 list">
                <div className="box">
                    <table>
                        <thead>
                            <TableHead headings={headings} />
                        </thead>
                        <tbody>
                            {accounts.map((row, index) => (
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
                                                <Link to='#' onClick={() => handleDelete(row.id)}>
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
            </div>

        </div>
    );
};

export default ListAccount;
