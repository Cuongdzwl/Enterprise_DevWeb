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
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleBack = () => { navigate(`/student/event/contribution/${id}`) }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isSubmitting) {
            return;
        }
        setIsSubmitting(true);

        const formDataToSend = new FormData();
        formDataToSend.append('Name', formData.Name);
        formDataToSend.append('Content', formData.Content);
        formDataToSend.append('IsPublic', formData.IsPublic);
        formDataToSend.append('IsApproved', formData.IsApproved);
        formDataToSend.append('EventID', id);
        formDataToSend.append('UserID', UserID);
        formDataToSend.append('StatusID', 1);

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
            setIsSubmitting(false);
        }
    };

    const handleOpen = () => {
        setIsActive(true);
    }

    const handleClose = (e) => {
        e.preventDefault();
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
                <div className="box"
                    style={{
                        height: '100vh'
                    }}
                >
                    <div className="box-content contribution">
                        <form encType='multipart/form-data'
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
                                <textarea required name="Content" cols="30" rows="10" value={formData.Content}
                                    onChange={handleChange}></textarea>
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

                            <div className="form-action">
                                <button type="button" onClick={handleBack} className="btn">Cancel</button>
                                <button type="button" className="btn" onClick={handleOpen}>Create</button>
                            </div>

                            <div className={`term-conditions ${isActive ? 'active' : ''}`}>
                                <div className="title">
                                    Terms and Conditions
                                </div>
                                {/* Content of terms and conditions */}
                                <div className="content">
                                    <div>Last Revised: April 16, 2024</div>
                                    <div>1. Introduction</div>
                                    <span>By using the University Greenwich Contribution System, you agree to these Terms and Conditions. If you do not agree with these Terms and Conditions, please do not use the System</span>
                                    <div>2. Eligibility</div>
                                    <span>The System is intended for use by students of the University for the purpose of submitting contributions to the annual University Greenwich.</span>
                                    <div>3. User Responsibilities</div>
                                    <span>Users are responsible for the content of their contributions. Users agree not to submit any content that is illegal, defamatory, or infringes on the rights of others.</span>
                                    <div>4. Submission Guidelines</div>
                                    <span>Users can submit one or more articles as Word documents and/or high-quality images. All submissions must be original work by the user.</span>
                                    <div>5. Review Process</div>
                                    <span>Once a contribution is submitted, it will be reviewed by the Faculty’s Marketing Coordinator. The Marketing Coordinator may interact with the user to edit the contributions and select those for publication.</span>
                                    <div>6. Deadlines</div>
                                    <span>All new contributions are disabled after a closure date for new entries, but updates can continue to be done until a final closure date. Users are responsible for adhering to these deadlines.</span>
                                    <div>7. Privacy</div>
                                    <span>The University respects the privacy of its students. Please refer to our Privacy Policy for more information on how we collect, use, and protect your personal information.</span>
                                    <div>8. Changes to Terms and Conditions</div>
                                    <span>The University reserves the right to change these Terms and Conditions at any time. Users will be notified of any changes and continued use of the System constitutes acceptance of the changes.</span>
                                    <div>9. Contact</div>
                                    <span>If you have any questions about these Terms and Conditions, please contact the University Marketing Manager.</span>

                                    <span>
                                        PLEASE NOTE: By submitting a contribution to the System, you confirm that you have read, understood, and agree to these Terms and Conditions.
                                    </span>
                                </div>
                                <div className="form-action">
                                    <button type="submit" disabled={isSubmitting} className="btn" onClick={handleSubmit}>Accept</button>
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
