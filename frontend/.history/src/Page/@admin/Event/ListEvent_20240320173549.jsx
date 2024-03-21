import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Search from '../../../components/Search';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate } from 'react-router-dom';

const headings = ['Name', 'Description', 'Faculty', 'Closure Date', 'Due Date', 'Action'];

const ListEvent = () => {
    const { data: eventData, error } = useFetch('http://localhost:3000/event');
    const { data: facultyData } = useFetch('http://localhost:3000/faculty');

    const navigate = useNavigate();
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (eventData) {
            setEvents(eventData);
        }
    }, [eventData]);

    if (error) {
        return <p>Error fetching data: {error.message}</p>;
    }
    if (!events || !facultyData) {
        return (
            <div className="box">
                <div className="row-1">
                    <div className="header">
                        <div className="title">List Event</div>
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

    const facultyMap = {};
    facultyData.forEach(faculty => {
        facultyMap[faculty.id] = faculty.name;
    });

    const handleDelete = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/event/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete event');
            }
            setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    };

    const filteredEvents = events.filter(event =>
        event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Event</div>
                </div>

                <Search placeholder={'Search Event'} value={searchTerm} onChange={handleSearchChange} />

                <div className="create">
                    <button className="custom-button" onClick={() => navigate('/admin/event/create')}>Create</button>
                </div>
            </div>

            <div className="row-2 list">
                <div className="box">
                    <table>
                        <thead>
                            <TableHead headings={headings} />
                        </thead>
                        <tbody>
                            {filteredEvents.length > 0 ? (
                                filteredEvents.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row.name}</td>
                                        <td>{row.de}</td>
                                        <td>{facultyMap[row.faculty]}</td>
                                        <td>{row.closureDate}</td>
                                        <td>{row.dueDate}</td>

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

export default ListEvent;
