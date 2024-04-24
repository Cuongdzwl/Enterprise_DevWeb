import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FormGroup from '../../../../components/FormGroup';
import Loading from '../../../../components/Loading';
import { ApiResponse } from '../../../../Api';
import useFetch from '../../../../CustomHooks/useFetch';
import { jwtDecode } from 'jwt-decode';

const Data = {
    Name: "",
    Content: "",
    IsPublic: false,
    IsApproved: false,
    EventID: 0,
    UserID: 0,
    StatusID: '',
    filesPath: [],
    file2: []
}

const UpdateContributionS = () => {
    const [formData, setFormData] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: contribution } = useFetch(`${ApiResponse}contributions/${id}?depth=1`);
    
    const EventID = contribution?.EventID;
    const StatusID = contribution?.StatusID;
    console.log('before:', StatusID);



    useEffect(() => {
        if (contribution) {
            setFormData(contribution);
        }
    }, [contribution])

    // Decode token
    const token = localStorage.getItem('token');
    const decodedToken = jwtDecode(token);

    // get userID from token
    const UserID = decodedToken.id;

    if (!contribution) {
        return <Loading />
    }

    // Handle event
    const handleChange = (e) => {
        const { name, value, files } = e.target;

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

    const handleBack = () => {
        navigate(`/student/event/contribution/${EventID}/`);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('Name', formData.Name);
        formDataToSend.append('Content', formData.Content);
        // formDataToSend.append('IsPublic', formData.IsPublic);
        // formDataToSend.append('IsApproved', formData.IsApproved);
        formDataToSend.append('EventID', EventID);
        formDataToSend.append('UserID', UserID);
        // formDataToSend.append('StatusID', 2);
        // console.log('after:', formData.StatusID);

        formData.filesPath?.forEach(file => {
            formDataToSend.append('filesPath', file);
        });
        formData.file2?.forEach(file => {
            formDataToSend.append('file2', file);
        });

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

            navigate(`/student/event/contribution/${EventID}/`);
        } catch (error) {
            console.error('Error update contribution:', error);
            setError('Failed to update contribution. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Update Contribution</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box"
                     style={{
                         height: '100vh'
                     }}
                >
                    <div className="box-content contribution">
                        <form onSubmit={handleSubmit} encType='multipart/form-data'
                              style={{width: '100%'}}
                        >
                            <FormGroup
                                label={'Name'}
                                inputType={'text'}
                                inputName={'Name'}
                                value={formData.Name}
                                onChange={handleChange}
                            />

                            <div className="form-group">
                                <label>Content</label>
                                <textarea required name="Content" cols="30" rows="10" value={formData.Content}
                                          onChange={handleChange}></textarea>
                            </div>

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
                                <button type="button" className="btn" onClick={handleSubmit}>Update</button>
                            </div>

                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateContributionS;
