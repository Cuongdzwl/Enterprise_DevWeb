import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Search from '../../../components/Search';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading';
import { ApiResponse } from '../../../Api';

const headings = ['Name', 'Description', 'Number event', 'Guest', 'Action'];

const ListFaculty = () => {
    // Fetch data
    const { data: facultyData } = useFetch(`${ApiResponse}faculties`);
    const { data: eventData } = useFetch(`${ApiResponse}events`);

    // State
    const navigate = useNavigate();
    const [faculty, setFaculty] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [facultyEvents, setFacultyEvents] = useState([]);
    const [error, setError] = useState(null);

    // Set faculty and count number of events by faculty
    useEffect(() => {
        if (facultyData && eventData) {
            setFaculty(facultyData);

            // Count number of events by faculty
            const eventCountsByFaculty = {};
            eventData.forEach(event => {
                if (!eventCountsByFaculty[event.FacultyID]) {
                    eventCountsByFaculty[event.FacultyID] = 1;
                } else {
                    eventCountsByFaculty[event.FacultyID]++;
                }
            });
            setFacultyEvents(eventCountsByFaculty);
        }
    }, [facultyData, eventData]);

    // Handle Event
    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${ApiResponse}faculties/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                
            });

            if (!response.ok) {
                const data = response.json();
                data.then(data => setError(data.message))
            }
            setFaculty(prevFaculty => prevFaculty.filter(faculty => faculty.ID !== id));
        } catch (error) {
            console.error('Error deleting faculty:', error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    // Filter faculty
    const filteredFaculty = faculty.filter(faculty =>
        faculty.Name.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
                                        <td>{row.Name}</td>
                                        <td className="description">{row?.Description}</td>
                                        <td className="number-event">{facultyEvents[row.ID] || 0}</td>
                                        <td>
                                            <span className={`guest-status ${row.IsEnabledGuest ? "active" : ""}`}>
                                                {row.IsEnabledGuest ? "Yes" : "No"}
                                            </span>
                                        </td>


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

export default ListFaculty;
