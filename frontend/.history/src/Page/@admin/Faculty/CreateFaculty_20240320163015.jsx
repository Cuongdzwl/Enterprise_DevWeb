import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate } from 'react-router-dom';

const CreateFaculty = () => {
    const defaultPassword = '12345678';

    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState({
        name: '',
        description: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const { data: roleData } = useFetch('http://localhost:3000/role');
    const { data: facultyData } = useFetch('http://localhost:3000/faculty');

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
        navigate(-1);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isFormValid) {
            setError("Please fill in all fields correctly.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:3000/faculty', {
                method: 'POST',
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

    return (
        <div className="box">
            <div className="box-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className='form-control' required name="name" value={formData.name} onChange={handleChange} />
                        {validationErrors.name && <div className="error">{validationErrors.name}</div>}
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className='form-control' required name="email" value={formData.email} onChange={handleChange} />
                        {validationErrors.email && <div className="error">{validationErrors.email}</div>}
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" className='form-control' required name="phone" value={formData.phone} onChange={handleChange} />
                        {validationErrors.phone && <div className="error">{validationErrors.phone}</div>}
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" className='form-control' required name="address" value={formData.address} onChange={handleChange} />
                        {validationErrors.address && <div className="error">{validationErrors.address}</div>}
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select value={formData.role} onChange={handleChange} className='form-control' required name="role">
                            <option value="" hidden>Select Role</option>
                            {roleData && roleData.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        {validationErrors.role && <div className="error">{validationErrors.role}</div>}
                    </div>
                    <div className="form-group mb-input">
                        <label>Faculty</label>
                        <select value={formData.faculty} onChange={handleChange} className='form-control' required name="faculty">
                            <option value="" hidden>Select Faculty</option>
                            {facultyData && facultyData.map((faculty) => (
                                <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                            ))}
                        </select>
                        {validationErrors.faculty && <div className="error">{validationErrors.faculty}</div>}
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
    );
};

export default CreateFaculty;
