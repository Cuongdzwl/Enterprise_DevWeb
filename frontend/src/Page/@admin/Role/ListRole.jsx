import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Search from '../../../components/Search';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading';

const ApiResponse = 'https://dev-nodejs.cuongnd.work/api/v1/'

const headings = ['Name', 'Description', 'Action'];

const ListRole = () => {
    // Fetch data
    const { data: roleData, error } = useFetch(`${ApiResponse}roles`);

    // State
    const navigate = useNavigate();
    const [role, setRole] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Set Data
    useEffect(() => {
        if (roleData) {
            setRole(roleData);
        }
    }, [roleData]);

    if (!roleData) {
        return (
            <Loading />
        );
    }

    // Handle Event
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${ApiResponse}roles/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });
            if (!response.ok) {
                const data = response.json();
                throw new Error(data.then(data => (data.message)));
            }
            setRole(prevRole => prevRole.filter(role => role.ID !== id));
        } catch (error) {
            console.error('Error deleting role:', error);
        }
    };

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

                <div className="create">
                    <button className="custom-button" onClick={() => navigate('/admin/role/create')}>Create</button>
                </div>
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
                                        <td className="description">{row.Description}</td>
                                        <td colSpan="2">
                                            <ul className="menu-action">
                                                <li>
                                                    <Link to={`detail/${row.ID}`}>
                                                        <i className="fa-solid fa-circle-info"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to={`update/${row.ID}`}>
                                                        <i className="fa-solid fa-pen-to-square"></i>
                                                    </Link>
                                                </li>
                                                <li>
                                                    <Link to='#' onClick={() => handleDelete(row.ID)}>
                                                        <i className="fa-solid fa-trash"></i>
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
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListRole;
