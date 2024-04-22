import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Search from '../../../components/Search';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ApiResponse } from '../../../Api';
import Loading from '../../../components/Loading';

const headings = ['Name', 'Content', 'Image', 'File'];

const ListContributionG = () => {
    // Fetch data
    const token = localStorage.getItem('guest');
    const guest = JSON.parse(token);
    const faculityID = guest?.FacultyID;


    const { data: contributionData, error } = useFetch(`${ApiResponse}faculties/public/${faculityID}`);

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
    const handleSearchChange = (contribution) => {
        setSearchTerm(contribution.target.value);
    };

    const handleDetailClick = (ID) => {
        return () => {
            navigate(`/guest/public/detail/${ID}`, {state: contribution});
        };
    };

    // Filter data
    const filteredContribution = contribution ?
        contribution.filter(item =>
            item.Name.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];

    // Split files
    const splitFiles = (str) => {
        const files = str?.split('/');
        return files?.[files?.length - 1]
    }



    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Contribution Public</div>
                </div>

                <Search placeholder={'Search Contribution'} value={searchTerm} onChange={handleSearchChange} />

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
                                <tr onClick={handleDetailClick(row?.ID)} key={index}>
                                    <td>{row?.Name}</td>
                                    <td>{row?.Content}</td>
                                    <td>
                                        <img
                                            width={50 + 'px'}
                                            height={50 + 'px'}
                                            src={row?.Files[0]?.Url}/>
                                    </td>
                                    <td>{(splitFiles(row?.Files[1]?.Url))}</td>

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

export default ListContributionG;
