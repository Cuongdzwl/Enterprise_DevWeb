import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Search from '../../../components/Search';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate } from 'react-router-dom';

const headings = ['Name', 'Description', 'Number event', 'Guest', 'Action'];

const ListFaculty = () => {
    const { data: facultyData, error } = useFetch('http://localhost:3000/faculty', { method: 'GET' });

    const navigate = useNavigate();
    const [faculty, setFaculty] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (facultyData) {
            setFaculty(facultyData);
        }
    }, [facultyData]);

    if (error) {
        return <p>Error fetching data: {error.message}</p>;
    }
    if (!facultyData) {
        return (
            <div className="box">
                <div className="row-1">
                    <div className="header">
                        <div className="title">List Faculty</div>
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

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/faculty/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete faculty');
            }
            setFaculty(prevFaculty => prevFaculty.filter(faculty => faculty.id !== id));
        } catch (error) {
            console.error('Error deleting faculty:', error);
        }
    };

    const filteredFaculty = faculty.filter(faculty =>
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Faculty</div>
                </div>

                <Search placeholder={'Search Faculty'} value={searchTerm} onChange={handleSearchChange} />

                <div className="create">
                    <button className="custom-button" onClick={() => navigate('/admin/faculty/create')}>Create</button>
                </div>
            </div>

            <div className="row-2 list">
                <div className="box">
                    <table>
                        <thead>
                            <TableHead headings={headings} />
                        </thead>
                        <tbody>
                            {filteredFaculty.length > 0 ? (
                                filteredFaculty.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.name}</td>
                                        <td className="description" style={{ maxWidth: "208.78px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.description}</td>
                                        <td className="number-event">3</td>
                                        <td>
                                            <span className={`guest-status ${row.guest ? "active" : ""}`}>
                                                {row.guest ? "Yes" : "No"}
                                            </span>
                                        </td>


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

export default ListFaculty;
