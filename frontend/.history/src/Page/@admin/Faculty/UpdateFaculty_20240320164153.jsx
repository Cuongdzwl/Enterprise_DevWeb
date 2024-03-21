import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';

const UpdateFaculty = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        guest: false
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        name: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const { data: faculty } = useFetch('http://localhost:3000/faculty');

    useEffect(() => {
        if (faculty) {
            const { name, description, guest } = faculty;
            setFormData({  name, description, guest });
        }
    }, [faculty]);


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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setError("Please fill in all fields correctly.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`http://localhost:3000/faculty/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to create faculty');
            }
            navigate(-1);
        } catch (error) {
            console.error('Error creating faculty:', error);
            setError('Failed to create faculty. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!faculty) {
        return <p>Loading...</p>;
    }

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Update faculty</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content">
                    <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className='form-control' required name="name" value={formData.name} onChange={handleChange} />
                                {validationErrors.name && <div className="error">{validationErrors.name}</div>}
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea required name="description" cols="30" rows="10" value={formData.description} onChange={handleChange}></textarea>
                                {validationErrors.description && <div className="error">{validationErrors.description}</div>}
                            </div>

                            <div className="form-group mb-input">
                                <label>Guest</label>
                                <select value={formData.guest} onChange={handleChange} className='form-control' required name="guest">
                                    <option value="" hidden>Select Guest</option>
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </select>
                            </div>

                            <div className="form-action">
                                <button type="submit" onClick={handleBack} className="btn">Cancel</button>
                                <button type="submit" disabled={!isFormValid || isLoading} className="btn">Create</button>
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

export default UpdateFaculty;
