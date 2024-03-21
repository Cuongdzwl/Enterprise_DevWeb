import React, { useState, useEffect } from 'react';
import TableHead from '../../../components/TableHead';
import Skeleton from 'react-loading-skeleton';
import { Link } from 'react-router-dom';
import useFetch from '../../../CustomHooks/useFetch';

const headings = ['Full Name', 'Email', 'Faculty', 'Role', 'Action'];

const ListAccount = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [accountData, setAccountData] = useState(null);
    const [roleData, setRoleData] = useState(null);
    const [facultyData, setFacultyData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const useFetchData = async () => {
                    const [accountRes, roleRes, facultyRes] = await Promise.all([
                        useFetch('http://localhost:3000/account', { method: 'GET' }),
                        useFetch('http://localhost:3000/role', { method: 'GET' }),
                        useFetch('http://localhost:3000/faculty', { method: 'GET' })
                    ]);

                    if (accountRes.error || roleRes.error || facultyRes.error) {
                        throw new Error('Failed to fetch data');
                    }

                    setAccountData(accountRes.data);
                    setRoleData(roleRes.data);
                    setFacultyData(facultyRes.data);
                    setIsLoading(false);
                };

                const useFetchData = async () => {
                    const [accountRes, roleRes, facultyRes] = await Promise.all([
                        useFetch('http://localhost:3000/account', { method: 'GET' }),
                        useFetch('http://localhost:3000/role', { method: 'GET' }),
                        useFetch('http://localhost:3000/faculty', { method: 'GET' })
                    ]);

                    if (accountRes.error || roleRes.error || facultyRes.error) {
                        throw new Error('Failed to fetch data');
                    }

                    setAccountData(accountRes.data);
                    setRoleData(roleRes.data);
                    setFacultyData(facultyRes.data);
                    setIsLoading(false);
                };

                useEffect(() => {
                    const fetchData = async () => {
                        try {
                            await useFetchData();
                        } catch (error) {
                            setError(error.message);
                            setIsLoading(false);
                        }
                    };

                    fetchData();
                }, []);
            } catch (error) {
                setError(error.message);
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (error) {
        return <p>Error fetching data: {error}</p>;
    }

    if (isLoading || !accountData || !roleData || !facultyData) {
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

    return (
        <div className="box">
            <table>
                <thead>
                    <TableHead headings={headings} />
                </thead>
                <tbody>
                    {accountData.map((row, index) => (
                        <tr key={index}>
                            <td>{row.name}</td>
                            <td>{row.email}</td>
                            <td>{facultyMap[row.faculty]}</td>
                            <td>{roleMap[row.role]}</td>
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
