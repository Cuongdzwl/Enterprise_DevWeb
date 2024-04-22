import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Search from '../../../components/Search';
import { Link, useNavigate } from 'react-router-dom';
import { ApiResponse } from '../../../Api';

const headings = ['Name', 'Action'];

const ListRole = () => {
    // Fetch data
    const { data: roleData, error } = useFetch(`${ApiResponse}roles`);

    // State
    const [role, setRole] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Set Data
    useEffect(() => {
        if (roleData) {
            setRole(roleData);
        }
    }, [roleData]);

    // Handle Event
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter Role
    const filteredRole = role.filter(role =>
        role.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );


    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Role</div>
                </div>

                <Search placeholder={'Search Role'} value={searchTerm} onChange={handleSearchChange} />
            </div>

            <div className="row-2 list">
                <div className="box">
                    <table>
                        <thead>
                            <TableHead headings={headings} />
                        </thead>
                        <tbody>
                            {filteredRole.length > 0 ? (
                                filteredRole.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.Name}</td>
                                        <td colSpan="2">
                                            <ul className="menu-action center">
                                                <li>
                                                    <Link to={`detail/${row.ID}`}>
                                                        <i className="fa-solid fa-circle-info"></i>
                                                    </Link>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headings.length}>Not Found</td>
                                </tr>
                            )}
                            {error && <div className="error">{error}</div>}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListRole;
