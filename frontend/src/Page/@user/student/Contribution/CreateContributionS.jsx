import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormGroup from '../../../../components/FormGroup';
import Loading from '../../../../components/Loading';
import { ApiResponse } from '../../../../Api';
import { jwtDecode } from 'jwt-decode';

const Data = {
    Name: "",
    Content: "",
    IsPublic: false,
    IsApproved: false,
    EventID: 0,
    UserID: 0,
    StatusID: 1,
    filesPath: [],
    file2: []
}

const CreateContributionS = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [isFormValid, setIsFormValid] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [error, setError] = useState(null);

    // Navigate, ID
    const navigate = useNavigate();
    const { id } = useParams();

    // Decode token
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    // get userID from token
    const UserID = decodedToken.id;


    // Validate form
    useEffect(() => {
        setIsFormValid(Object.values(validationErrors).every(error => error === ''));
    }, [validationErrors, formData]);

    // Validate form
    const validateField = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'Name':
                errorMessage = value.trim() ? '' : 'Name is required.';
                break;
            case 'Content':
                errorMessage = value.trim() ? '' : 'Content is required.';
                break;
            case 'filesPath':
                errorMessage = value.trim() ? '' : 'Content is required.';
                break;
            case 'file2':
                errorMessage = value.trim() ? '' : 'Content is required.';
                break;
            default:
                break;
        }
        setValidationErrors(prevState => ({ ...prevState, [name]: errorMessage }));
    };

    // Handle Event
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        validateField(name, value);

        if (name === 'filesPath' || name === 'file2') {
            const selectedFiles = Array.from(files);

            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: selectedFiles
            }));
        } else {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: value
            }));
        }
    };

    const handleBack = () => {navigate(`/student/event/contribution/${id}`)}

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('Name', formData.Name);
        formDataToSend.append('Content', formData.Content);
        formDataToSend.append('IsPublic', formData.IsPublic);
        formDataToSend.append('IsApproved', formData.IsApproved);
        formDataToSend.append('EventID', id);
        formDataToSend.append('UserID', UserID);
        formDataToSend.append('StatusID', 0);

        formData.filesPath.forEach(file => {
            formDataToSend.append('filesPath', file);
        });
        formData.file2.forEach(file => {
            formDataToSend.append('file2', file);
        });

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`${ApiResponse}contributions/`, {
                method: 'POST',
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

            navigate(`/student/event/contribution/${id}`);
        } catch (error) {
            console.error('Error creating contribution:', error);
            setError('Failed to create contribution. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleOpen = () => {
        setIsActive(true);
    }

    const handleClose = () => {
        setIsActive(false);
    }

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Create Contribution</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content contribution">
                        <form onSubmit={handleSubmit} encType='multipart/form-data'
                            style={{ width: '100%' }}
                        >
                            <FormGroup
                                label={'Name'}
                                inputType={'text'}
                                inputName={'Name'}
                                value={formData.Name}
                                onChange={handleChange}
                            />
                            {validationErrors.Name && <div className="error">{validationErrors.Name}</div>}

                            <div className="form-group">
                                <label>Content</label>
                                <textarea required name="Content" cols="30" rows="10" value={formData.Content} onChange={handleChange}></textarea>
                            </div>
                            {validationErrors.Content && <div className="error">{validationErrors.Content}</div>}

                            <div className="form-group">
                                <label>Image</label>
                                <input
                                    type="file"
                                    multiple
                                    accept='image/*'
                                    name="filesPath"
                                    className='input-file'
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-group">
                                <label>File</label>
                                <input
                                    type="file"
                                    multiple
                                    accept='.docx'
                                    name="file2"
                                    className='input-file'
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="mb-input"></div>

                            <div className="form-action">
                                <button type="button" onClick={handleBack} className="btn">Cancel</button>
                                <button type="button" className="btn" onClick={handleOpen}>Create</button>
                            </div>

                            <div className={`term-conditions ${isActive ? 'active' : ''}`}>
                                <div className="title">
                                    Term and conditions
                                </div>
                                {/* Content of terms and conditions */}
                                <div className="content">
                                    <div>General Site Usage</div>
                                    <div>Last Revised: December 16, 2013</div>
                                    <span>Lorem Ipsum is simply dummy text of the printing and typesetting
                                        industry.
                                        Lorem Ipsum has been the industry s standard dummy text ever since the
                                        1500s, when an unknown printer took a galley of type and scrambled it to
                                        make a type specimen book. It has survived not only five centuries, but
                                        also
                                        the leap into electronic typesetting, remaining essentially unchanged.
                                        It
                                        was popularised in the 1960s with the release of Letraset sheets
                                        containing
                                        Lorem Ipsum passages, and more recently with desktop publishing software
                                        like Aldus PageMaker including versions of Lorem Ipsum.</span>
                                    <div>1. Your Agreement</div>
                                    <span>It is a long established fact that a reader will be distracted by the
                                        readable content of a page when looking at its layout. The point of
                                        using
                                        Lorem Ipsum is that it has a more-or-less normal distribution of
                                        letters, as
                                        opposed to using Content here, content here, making it look like
                                        readable
                                        English.</span>
                                    <span>
                                        PLEASE NOTE: Many desktop publishing packages and web page editors now
                                        use
                                        Lorem Ipsum as their default model text, and a search for lorem ipsum
                                        will
                                        uncover many web sites still in their infancy.
                                    </span>
                                </div>
                                <div className="form-action">
                                    <button type="submit" className="btn" onClick={handleSubmit}>Accept</button>
                                    <button type="submit" className="btn" onClick={handleClose}>Decline</button>
                                </div>
                            </div>

                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateContributionS;
