import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormGroup from '../../../../components/FormGroup';
import Loading from '../../../../components/Loading';
import useFetch from '../../../../CustomHooks/useFetch';
import { ApiResponse } from '../../../../Api';
import { format } from 'date-fns';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const Data = {
    Name: "",
    Content: "",
    IsPublic: false,
    IsApproved: false,
    EventID: 0,
    UserID: 0,
    StatusID: 1,
}

const DetailContributionS = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [UpdatedAt, setUpdatedAt] = useState(null);
    const [error, setError] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch data
    const { data: contribution } = useFetch(`${ApiResponse}contributions/${id}?depth=1&file=true&comment=true`);

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

    const UserName = contribution?.User.Name;
    const EventID = contribution?.EventID;


    // Handle Event
    const handleBack = () => {
        navigate(`/student/event/contribution/${EventID}/`); // Go back
    }

    const handleOpen = () => {
        setIsActive(true);
    }

    const handleClose = () => {
        setIsActive(false);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);

        const data = {
            Content: comment,
            ContributionID: parseInt(id)
        }

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
                setComments([...comments, { Content: comment, User: { Name: UserName } }]);
                setComment('');
            }
        } catch (error) {
            console.log('Error creating comment:', error);
            setError('Failed to create comment. Please try again later.');
        }finally {
            setIsLoading(false);
            setIsSubmitting(false);
        }
    }

    // Set Data
    useEffect(() => {
        if (contribution) {
            setFormData(contribution);
            setUpdatedAt(contribution.UpdatedAt);
            setComments(contribution.Comments);
        }
    }, [contribution]);

    const formatDate = (date) => {
        return format(new Date(date), "EEEE, d MMMM yyyy, hh:mm a");
    }

    function getTimeDifference(lastModified) {
        const modifiedDate = new Date(lastModified);
        const currentDate = new Date();
        const timeDiff = Math.abs(currentDate - modifiedDate);

        const hours = Math.floor(timeDiff / 3600000);
        const minutes = Math.floor((timeDiff % 3600000) / 60000);

        return { hours, minutes };
    }
    const { hours, minutes } = getTimeDifference(UpdatedAt);

    if (!contribution) {
        return (
            <Loading />
        )
    }

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
                    <div className="title">Detail Contribution</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box detail">
                    <div className="box-content contribution detail">
                        <form>
                            <FormGroup
                                label={'Name'}
                                inputType={'text'}
                                inputName={'Name'}
                                value={formData.Name}
                                readOnly={true}
                            />

                            <div className="form-group">
                                <label>Content</label>
                                <textarea name="" id="" cols="30" rows="10" value={formData.Content} readOnly></textarea>
                            </div>

                            <div className="form-group">
                                <label>Image</label>
                                <div className="image"
                                    style={{
                                        backgroundImage: `url(${imageFile})`,
                                        backgroundSize: 650 + 'px ' + 298 + 'px',
                                        backgroundRepeat: 'no-repeat'
                                    }}
                                >

                                </div>
                            </div>
                            <div className="mb-input"></div>

                            <div className="form-action">
                                <button type="button" className="btn" onClick={handleBack}>Back</button>
                            </div>

                        </form>
                        <div className="content-right">
                            <table className=" date-time">
                                <tbody>
                                    <tr>
                                        <td className="label">Closure Date</td>
                                        <td className='value'>{formatDate(contribution.Event.ClosureDate ?? null)}</td>
                                    </tr>
                                    <tr>
                                        <td className="label">Final Date</td>
                                        <td className='value'>{formatDate(contribution.Event.FinalDate ?? null)}</td>
                                    </tr>
                                    <tr>
                                        <td className="label">Time Remaining</td>
                                        <td className="value">{`Contribution was submitted ${hours} hours ${minutes} mins ago`}</td>
                                    </tr>
                                    <tr>
                                        <td className="label">Last Modified</td>
                                        <td className="value">{formatDate(UpdatedAt)}</td>
                                    </tr>
                                </tbody>
                            </table>

                            <div className="content-flex ">
                                <FormGroup
                                    label={'File'}
                                    inputType={'text'}
                                    inputName={'File'}
                                    value={nameFile ?? null}
                                    readOnly={true}
                                />

                                <div className="download">
                                    <a href='#' onClick={handleOpen}>
                                        <i className="fa-regular fa-eye">
                                        </i>
                                    </a>
                                </div>

                                <div className="download">
                                    <a href={textFile} download>
                                        <i className="fa-solid fa-file-arrow-down"></i>
                                    </a>
                                </div>
                            </div>

                            <form onSubmit={handleSubmit} >
                                <div className="form-group comments">
                                    <label>Comments {`(${comments.length})`}</label>
                                    <div className="list-comment">
                                        {
                                            comments?.map((comment, index) => {
                                                return (
                                                    <div className="comment-item" key={index}>
                                                        <div className="user">{comment.User?.Name}</div>
                                                        <div className="description">{comment?.Content}</div>
                                                    </div>
                                                )

                                            })
                                        }
                                    </div>

                                    <div style={{ position: 'relative' }}>
                                        <input type="text"
                                            name="comment"
                                            className="form-control"
                                            placeholder="Write a comment..."
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        />
                                        <button type="submit" disabled={isSubmitting}>
                                            <i className="fa-solid fa-paper-plane"></i>
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailContributionS;
