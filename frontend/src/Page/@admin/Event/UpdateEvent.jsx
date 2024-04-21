import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiResponse } from '../../../Api';
import FormGroup from '../../../components/FormGroup';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { setHours, setMinutes } from 'date-fns';
import Loading from '../../../components/Loading';

const Data = {
    Name: '',
    Description: '',
    FacultyID: '',
    ClosureDate: '',
    FinalDate: ''
}

const UpdateEvent = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // State Date
    const [startDate, setStartDate] = useState(
        setHours(setMinutes(new Date(), 30), 16)
    );
    const [endDate, setEndDate] = useState(
        setHours(setMinutes(new Date(), 30), 16)
    );

    // ID, Redirect
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch data
    const { data: event } = useFetch(`${ApiResponse}events/${id}?depth=1`);
    const facultyData = useFetch(`${ApiResponse}faculties`);

    // Set Data    
    useEffect(() => {
        if (event) {
            setFormData(event);
        }
    }, [event]);

    useEffect(() => {
        if (formData.ClosureDate) {
            setStartDate(new Date(formData.ClosureDate));
        }
        if (formData.FinalDate) {
            setEndDate(new Date(formData.FinalDate));
        }
    }, [formData.ClosureDate, formData.FinalDate]);

    // Validate form
    useEffect(() => {
        setIsFormValid(Object.values(validationErrors).every(error => error === '') && Object.values(formData).every(value => value !== ''));
    }, [validationErrors, formData]);

    const validateField = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'Name':
                errorMessage = value.trim() && /^[A-Za-z\s]{1,50}$/.test(value) ? '' : 'Invalid event name: no numbers or special characters, max 15 chars.';
                break;
            case 'Description':
                errorMessage = value.trim() ? '' : 'Description is required.';
                break;
            case 'ClosureDate':
                errorMessage = value <= formData.FinalDate ? '' : 'Closure Date must be before Final Date.';
                break
            case 'FinalDate':
                errorMessage =  value >= formData.ClosureDate ? '' : 'Final Date must be after Closure Date.';
                break
            default:
                break;
        }
        setValidationErrors(prevState => ({ ...prevState, [name]: errorMessage }));
    };
    

    // Handle Event
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        validateField(name, value);
    };

    const handleBack = () => navigate('/admin/event')

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) {
            setError("Please fill in all fields correctly.");
            return;
        }
        setIsLoading(true);
        setError(null);

        const newFormData = {
            ...formData,
            FacultyID: parseInt(formData.FacultyID),
            ClosureDate: new Date(formData.ClosureDate).toISOString(),
            FinalDate: new Date(formData.FinalDate).toISOString()
        }

        try {
            const response = await fetch(`${ApiResponse}events/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                },
                body: JSON.stringify(newFormData)
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
                return;
            }
            navigate('/admin/event');
        } catch (error) {
            console.error('Error creating event:', error);
            setError('Failed to create event. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChangeStartDate = (date) => {
        setStartDate(date);
        setFormData(prevState => ({
            ...prevState,
            ClosureDate: date
        }));
    };

    const handleChangeEndDate = (date) => {
        setEndDate(date);
        setFormData(prevState => ({
            ...prevState,
            FinalDate: date
        }));
    };

    if (!event) {
        return <Loading />;
    }

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Update event</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content">
                        <form onSubmit={handleSubmit}>
                            <FormGroup
                                label={'Name'}
                                inputType={'text'}
                                inputName={'Name'}
                                value={formData.Name}
                                onChange={handleChange}
                            />
                            {validationErrors.Name && <div className="error">{validationErrors.Name}</div>}

                            <div className='form-group'>
                                <label style={{ marginBottom: 12 + 'px' }}>Description</label>
                                <CKEditor
                                    style={{ minHeight: '300px' }}
                                    editor={ClassicEditor}
                                    data={formData.Description}
                                    onChange={(event, editor) => {
                                        const data = editor.getData();
                                        setFormData(prevState => ({ ...prevState, Description: data }));
                                    }}
                                />
                                {validationErrors.Description && <div className="error">{validationErrors.Description}</div>}
                            </div>

                            <div className="form-group">
                                <label>Faculty</label>
                                <select value={formData.FacultyID} onChange={handleChange} className='form-control' name="FacultyID">
                                    <option value="" hidden>Select Faculty</option>
                                    {facultyData && Array.isArray(facultyData.data) && facultyData.data.map((faculty) => (
                                        <option key={faculty.ID} value={faculty.ID}>{faculty.Name}</option>
                                    ))}
                                </select>
                                {validationErrors.FacultyID && <div className="error">{validationErrors.FacultyID}</div>}
                            </div>

                            {/* Date */}
                            <div className="flex-row mb-input">
                                <div className="form-group">
                                    <label>Closure Date</label>
                                    <DatePicker
                                        selected={startDate}
                                        onChange={handleChangeStartDate}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        injectTimes={[
                                            setHours(setMinutes(new Date(), 1), 0),
                                            setHours(setMinutes(new Date(), 5), 12),
                                            setHours(setMinutes(new Date(), 59), 23),
                                        ]}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        className="form-control input-date"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Due Date</label>
                                    <DatePicker
                                        selected={endDate}
                                        onChange={handleChangeEndDate}
                                        showTimeSelect
                                        timeFormat="HH:mm"
                                        injectTimes={[
                                            setHours(setMinutes(new Date(), 1), 0),
                                            setHours(setMinutes(new Date(), 5), 12),
                                            setHours(setMinutes(new Date(), 59), 23),
                                        ]}
                                        dateFormat="MMMM d, yyyy h:mm aa"
                                        className="form-control input-date"
                                    />
                                </div>
                            </div>
                            {/* Date */}

                            <div className="form-action">
                                <button type="submit" onClick={handleBack} className="btn">Cancel</button>
                                <button type="submit" disabled={!isFormValid} className="btn">Update</button>
                            </div>
                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateEvent;
