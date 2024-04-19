import { useState, useEffect } from 'react';
import useFetch from '../../../../CustomHooks/useFetch';
import { Link } from 'react-router-dom';
import { ApiResponse } from '../../../../Api';
import Loading from '../../../../components/Loading';
import { jwtDecode } from 'jwt-decode';

const ListEventS = () => {
    // Fetch data
    const { data: eventData, error } = useFetch(`${ApiResponse}events/?depth=1`);

    // State
    const [events, setEvents] = useState([]);
    const [searchDate, setSearchDate] = useState('');

    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);
    const FacultyID = decodedToken.FacultyID;

    // Set Data
    useEffect(() => {
        if (eventData) {
            const filteredEvents = eventData.filter(event => event.FacultyID === FacultyID);
            setEvents(filteredEvents);
        }
    }, [eventData]);


    if (!events) {
        return (
            <Loading />
        )
    }

    // Handle Event
    const handleDateChange = (event) => {
        setSearchDate(event.target.value);
    };

    // Filter data
    const filteredEvents = events.filter(event =>
        event.FinalDate.includes(searchDate)
    );

    // Format Date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Event</div>
                </div>
                <input type="text"
                    className='filter-event'
                    value={searchDate}
                    placeholder='Filter Event &thinsp;&thinsp;&thinsp;&thinsp;&thinsp;&thinsp;&thinsp; &#128197;'
                    onFocus={(e) => e.target.type = 'date'}
                    onBlur={(e) => e.target.type = 'text'}
                    onChange={handleDateChange} />
            </div>

            <div className="row-2 list">
                <div className="box event-card">
                    <div className="list-event">
                        {
                            filteredEvents.length > 0 ? (
                                filteredEvents.map((row, index) => (
                                    <Link key={index} to={`detail/${row.ID}`}>
                                        <div className="event-item" key={index}>
                                            <div className="time-now">Today</div>
                                            <div className="event-title">{row.Name}</div>
                                            <div className="event-description text-truncate">
                                                <div dangerouslySetInnerHTML={{ __html: row.Description }} />
                                            </div>
                                            <div className="due-date">
                                                <i className="fa-regular fa-calendar"></i>
                                                {formatDate(row.FinalDate)}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <Loading />
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListEventS;
