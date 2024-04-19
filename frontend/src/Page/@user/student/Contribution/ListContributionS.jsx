import { useState, useEffect } from 'react';
import useFetch from '../../../../CustomHooks/useFetch';
import TableHead from '../../../../components/TableHead';
import Search from '../../../../components/Search';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiResponse } from '../../../../Api';
import Loading from '../../../../components/Loading';

const headings = ['Name', 'Content', 'Image', 'File', 'Status', 'Action'];

const ListContribution = () => {
    // Fetch data
    const { id } = useParams();
    const { data: contributionData, error } = useFetch(`${ApiResponse}events/${id}?depth=1&contribution=true`);
    // State
    const navigate = useNavigate();
    const [contribution, setContribution] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Set Data
    useEffect(() => {
        if (contributionData) {
            setContribution(contributionData);
        }
    }, [contributionData]);

    if (!contribution) {
        return (
            <Loading />
        )
    }

    // Handle Event
    if (!contribution || contribution.length === 0) {
        return (
            <Loading />
        )
    }


    const handleDelete = async (id) => {
        try {
            const response = await fetch(`${ApiResponse}contributions/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete contribution');
            }
            setContribution(prevContribution => {
                const updatedContributions = prevContribution.Contributions.filter(contribution => contribution.ID !== id);
                return {
                    ...prevContribution,
                    Contributions: updatedContributions
                };
            });
        } catch (error) {
            console.error('Error deleting contribution:', error);
        }
    };

    const handleSearchChange = (contribution) => {
        setSearchTerm(contribution.target.value);
    };

    const handleCreate = () => {
        navigate(`/student/event/contribution/${id}/create`);
    }

    const splitFiles = (str) => {
        const files = str?.split('/');
        return files?.[files?.length - 1]
    }

    const isBeforeClosureDate = new Date(contributionData?.ClosureDate) >= new Date()


    // Filter data
    const filteredContribution = contribution.Contributions ?
        contribution.Contributions.filter(item =>
            item.Name.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Contribution <p style={{
                        color: 'red'
                    }}>{!isBeforeClosureDate && 'Expired deadline for new submissions'}</p></div>
                </div>

                <Search placeholder={'Search Contribution'} value={searchTerm} onChange={handleSearchChange} />

                <div className="create">
                    {isBeforeClosureDate && (
                        <button className="custom-button" onClick={handleCreate}>Create</button>
                    )}
                </div>
            </div>

            <div className="row-2 list">
                <div className="box">
                    <table>
                        <thead>
                            <TableHead headings={headings} />
                        </thead>
                        <tbody>
                            {filteredContribution?.length > 0 ? (
                                filteredContribution?.map((row, index) => (
                                    <tr key={index}>
                                        <td>{row?.Name}</td>
                                        <td>{row?.Content}</td>
                                        <td>
                                            <img
                                                width={50 + 'px'}
                                                height={50 + 'px'}
                                                src={row?.ImageFiles[0]?.Url} />
                                        </td>


                                        <td>{(splitFiles(row?.TextFiles[0]?.Url))}</td>
                                        <td>
                                            <div className={`status-contribution ${row?.Status?.Name}`}>
                                                {row?.Status?.Name}
                                            </div>
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
                                                    {
                                                        isBeforeClosureDate && (<Link onClick={() => handleDelete(row.ID)}>
                                                            <i className="fa-solid fa-trash"></i>
                                                        </Link>)
                                                    }
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={headings?.length}>Not Found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ListContribution;
