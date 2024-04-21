import {useState, useEffect} from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Search from '../../../components/Search';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {ApiResponse} from '../../../Api';
import Loading from '../../../components/Loading';

const headings = ['Name', 'Content', 'Image', 'File', 'Action'];

const ListContributionPM = () => {
    // Fetch data
    const {id} = useParams();
    const {
        data: contributionData,
        error
    } = useFetch(`${ApiResponse}events/${id}?depth=1&contribution=true&isPublic=true`);

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
            <Loading/>
        )
    }

    // Handle Event
    const handleDownload = async (e) => {
        e.stopPropagation();
        const fileID = e.target.getAttribute('data-id');
        try {
            const response = await fetch(`${ApiResponse}contributions/${fileID}/download`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
            });

            if (!response.ok) {
                throw new Error('Failed to download contribution');
            }
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'file.zip');
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDetailClick = (ID) => {
        return () => {
            navigate(`/manager/public/${id}/detail/${ID}`);
        };
    };


    const handleSearchChange = (contribution) => {
        setSearchTerm(contribution.target.value);
    };

    // Filter data
    const filteredContribution = contribution.Contributions ?
        contribution.Contributions.filter(item =>
            item.Name.toLowerCase().includes(searchTerm.toLowerCase())
        ) : [];

    const splitFiles = (str) => {
        const files = str?.split('/');
        return files?.[files?.length - 1]
    }


    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Public Contribution</div>
                </div>

                <Search placeholder={'Search Contribution'} value={searchTerm} onChange={handleSearchChange}/>
            </div>

            <div className="row-2 list">
                <div className="box">
                    <table>
                        <thead>
                        <TableHead headings={headings}/>
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
                                            src={row?.ImageFiles[0]?.Url ?? null}/>
                                    </td>

                                    <td>{(splitFiles(row?.TextFiles[0]?.Url ?? null))}</td>

                                    <td colSpan="2">
                                        <span className='download-file'
                                              data-id={row?.ID}
                                              onClick={handleDownload}
                                        >Download</span>
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

export default ListContributionPM;
