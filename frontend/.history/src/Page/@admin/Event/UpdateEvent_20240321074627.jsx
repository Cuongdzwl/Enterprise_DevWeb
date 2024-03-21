import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateEvent = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        faculty: 0,
        closureDate: '',
        dueDate: '',
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        name: '',
        description: '',
        faculty: 0,
        closureDate: '',
        dueDate: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const { data: event } = useFetch(`http://localhost:3000/event/${id}`);
    const { data: facultyData } = useFetch('http://localhost:3000/faculty');

    useEffect(() => {
        if (event) {
            const { name, description, faculty, closureDate, dueDate } = event;
            setFormData({ name, description, faculty, closureDate, dueDate });
        }
    }, [event]);


    useEffect(() => {
        setIsFormValid(Object.values(validationErrors).every(error => error === '') && Object.values(formData).every(value => value !== ''));
    }, [validationErrors, formData]);

    const validateField = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'name':
                errorMessage = value.trim() ? '' : 'Name is required.';
                break;
            case 'description':
                errorMessage = value.trim() ? '' : 'Description is required.';
                break;
            default:
                break;
        }
        setValidationErrors(prevState => ({ ...prevState, [name]: errorMessage }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        validateField(name, value);
        const inputElement = e.target;
        if (validationErrors[name]) {
            inputElement.classList.remove('valid');
            inputElement.classList.add('invalid');
        } else {
            inputElement.classList.remove('invalid');
            inputElement.classList.add('valid');
        }
    };

    const handleBack = () => {
        navigate('/admin/event');
    }

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
            faculty: parseInt(formData.faculty),
            closureDate: new Date(formData.closureDate).toLocaleDateString('en-US'),
            dueDate: new Date(formData.dueDate).toLocaleDateString('en-US')
        }

        try {
            const response = await fetch(`http://localhost:3000/event/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newFormData)
            });
            if (!response.ok) {
                throw new Error('Failed to create event');
            }
            navigate(-1);
        } catch (error) {
            console.error('Error creating event:', error);
            setError('Failed to create event. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!event || !facultyData) {
        return <p>Loading...</p>;
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
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className='form-control' required value={formData.name} onChange={handleChange} />
                                {validationErrors.name && <div className="error">{validationErrors.name}</div>}
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea required name="description" cols="30" rows="10" value={formData.description} onChange={handleChange}></textarea>
                                {validationErrors.description && <div className="error">{validationErrors.description}</div>}
                            </div>
                            <div className="form-group mb-input">
                                <label>Faculty</label>
                                <select value={formData.faculty} onChange={handleChange} className='form-control' required name="faculty">
                                    <option value="" hidden>Select Faculty</option>
                                    {facultyData && facultyData.map((faculty) => (
                                        <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex-row mb-input">
                                <div className="form-group">
                                    <label>Closure Date</label>
                                    <input type="date" className="form-control input-date" />

                                </div>

                                <div className="form-group">
                                    <label>Due Date</label>
                                    <input type="date" className="form-control input-date" />
                                </div>
                            </div>

                            <div className="form-action">
                                <button type="submit" onClick={handleBack} className="btn">Cancel</button>
                                <button type="submit" disabled={!isFormValid || isLoading} className="btn">Update</button>
                            </div>
                            {isLoading && <span>Loading...</span>}
                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateEvent;
