import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormGroup from '../../../components/FormGroup';
import Loading from '../../../components/Loading';
import useFetch from '../../../CustomHooks/useFetch';
import { jwtDecode } from 'jwt-decode';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { ApiResponse } from '../../../Api';

const Data = {
    IsPublic: false,
    IsApproved: false,
    StatusID: 1
}

const UpdateContributionC = () => {
    const [formData, setFormData] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: contribution } = useFetch(`${ApiResponse}contributions/${id}?depth=1&file=true&comment=true`);
    const { data: status } = useFetch(`${ApiResponse}status`);
    const EventID = contribution?.EventID;

    // Set Data
    useEffect(() => {
        if (contribution) {
            const { IsPublic, IsApproved, StatusID } = contribution;
            setFormData({ IsPublic, IsApproved, StatusID });
            setComments(contribution.Comments);
        }
    }, [contribution]);

    if (!contribution) {
        return <Loading />;
    }

    // Get Name
    if (contribution) {
        var textFile = contribution?.TextFiles[0]?.Url;
        var imageFile = contribution?.ImageFiles[0]?.Url;

        if (textFile) {
            const splitFile = textFile?.split("/");
            var nameFile = splitFile[splitFile?.length - 1];
        }
    }

    const docs = [
        { uri: `${textFile}` },
    ];

    const handleClose = () => {
        setIsActive(false);
    }

    const handleOpen = () => {
        setIsActive(true);
    }

    const currentUser = localStorage.getItem('currentUser')
    const User = JSON.parse(currentUser)


    const handleSubmitComments = async (e) => {
        e.preventDefault();

        const data = {
            Content: comment,
            ContributionID: parseInt(id)
        };

        try {
            const res = await fetch(`${ApiResponse}comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(data)
            });

            if (!res.ok) {
                const data = await res.json();
                setError(data.message);
                return
            } else {
                setComments([...comments, { Content: comment, User: { Name: User.Name } }]);
                setComment('');
            }
        } catch (error) {
            console.log('Error creating comment:', error);
            setError('Failed to create comment. Please try again later.');
        }
    };

    // Handle Event
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleBack = () => {
        navigate(`/coordinator/event/contribution/${EventID}/`)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();

        const isPublic = formData.IsPublic === 'true';

        formDataToSend.append('IsPublic', isPublic);
        formDataToSend.append('StatusID', formData.StatusID);


        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${ApiResponse}contributions/${id}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: formDataToSend
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
                return;
            }
            navigate(`/coordinator/event/contribution/${EventID}`);
        } catch (error) {
            console.error('Error grade contribution:', error);
            setError('Failed to grade contribution. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="box">
            <div className={`view-file ${isActive ? 'active' : ''}`}>
                <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
                <div className="close-file-btn">
                    <button className='close-file' onClick={handleClose}>Close</button>
                </div>
            </div>
            <div className="row-1">
                <div className="header">
                    <div className="title">Grade Contribution - {contribution?.User?.Name} </div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content contribution coodinator"
                        style={{ display: 'block' }}
                    >
                        <form onSubmit={handleSubmit}
                            style={{ display: 'flex' }}
                        >
                            <div
                                style={{ width: '50%' }}
                            >
                                <div className="form-group">
                                    <label>Name</label>
                                    <input type="text" name="name" readOnly value={contribution.Name} className="form-control" />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea name="" id="" cols="30" rows="10" readOnly value={contribution.Content}></textarea>
                                </div>

                                <div className="form-group">
                                    <label>File</label>
                                    <div
                                        style={
                                            {
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                alignItems: 'center'
                                            }
                                        }>
                                        <input type="text" name="name"
                                            style={{ width: 'calc(100% - 75px)' }}
                                            value={textFile ? nameFile : 'No file uploaded'}
                                            className="form-control" />
                                        <div className="download"
                                            style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                marginTop: '12px',
                                                borderRadius: '8px',
                                                background: '#F1F2F5',
                                            }}
                                        >
                                            <a href='#'
                                                style={{
                                                    padding: '20px',
                                                    fontSize: '1.4rem',
                                                }}
                                                onClick={handleOpen}>
                                                <i className="fa-regular fa-eye">
                                                </i>
                                            </a>
                                        </div>
                                    </div>
                                </div>

                                <form>
                                    <div className="form-group comments">
                                        <label>Comments {`(${comments.length})`}</label>
                                        <div className="list-comment"
                                            style={{ width: 'auto' }}
                                        >
                                            {
                                                comments.map((comment, index) => {
                                                    return (
                                                        <div className="comment-item" key={index}>
                                                            <div className="user">{comment.User.Name}</div>
                                                            <div className="description">{comment.Content}</div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>

                                        <div style={{ position: 'relative' }}>
                                            <input type="text" name="name"
                                                style={{ width: '100%' }}
                                                value={comment}
                                                onChange={(e) => setComment(e.target.value)}
                                                className="form-control"
                                                placeholder="Write a comment..." />
                                            <button type="submit" onClick={handleSubmitComments}>
                                                <i className="fa-solid fa-paper-plane"></i>
                                            </button>
                                        </div>
                                    </div>

                                </form>
                            </div>

                            <div
                                style={{ marginLeft: 'auto' }}
                            >
                                <div className="form-group update">
                                    <label>Image</label>
                                    <div className="image-preview"
                                        style={{
                                            backgroundImage: `url(${imageFile})`,
                                            backgroundPosition: 'center',
                                            backgroundRepeat: 'no-repeat',
                                            backgroundSize: 'cover',
                                        }}
                                    >

                                    </div>
                                    <div className="form-group">
                                        <label>Status</label>
                                        <select className="form-control" name="StatusID"
                                            value={formData.StatusID}
                                            onChange={handleChange}>
                                            {
                                                status?.map((item, index) => (
                                                    <option value={item.ID} key={index}>{item.Name}</option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Public</label>
                                        <select
                                            className="form-control"
                                            name="IsPublic"
                                            value={formData.IsPublic}
                                            onChange={handleChange}
                                        >
                                            <option value="true">True</option>
                                            <option value="false">False</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="form-action">
                                    <button type="button" onClick={handleBack} className="btn">Back</button>
                                    <button type="submit" className="btn">Grade</button>
                                </div>
                                {error && <div className="error">{error}</div>}
                            </div>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default UpdateContributionC;
