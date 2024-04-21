import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../../../components/Loading';
import FormGroup from '../../../components/FormGroup';
import useFetch from '../../../CustomHooks/useFetch';
import { ApiResponse } from '../../../Api';

const Data = {
    Name: '',
    Email: '',
    Phone: '',
    Address: '',
    RoleID: '',
    FacultyID: ''
}

const CreateAccount = () => {
    const navigate = useNavigate();
    // Data
    const facultyData = useFetch(`${ApiResponse}faculties`);
    const roleData = useFetch(`${ApiResponse}roles`);

    // State
    const [formData, setFormData] = useState(Data);
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Validate form
    useEffect(() => {
        setIsFormValid(Object.values(validationErrors).every(error => error === ''));
    }, [validationErrors, formData]);

    const validateField = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'Name':
                errorMessage = value.trim() && /^[A-Za-z\s]{1,50}$/.test(value)  ? '' : 'Name is required and must be less than 15 characters.';
                break;
            case 'Email':
                errorMessage = /^\S+@\S+\.\S+$/.test(value) ? '' : 'Email is invalid.';
                break;
            case 'Phone':
                errorMessage = /^\+?[0-9]\d{1,20}$/.test(value) ? '' : 'Phone is invalid';
                break;
            case 'Address':
                errorMessage = value.length < 300 ? '' : 'Address is invalid, must have a maximum of 300 characters.';
                break;
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

    const handleBack = () => navigate('/admin/account');

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
            FacultyID: formData.FacultyID ? parseInt(formData.FacultyID) : '',
            RoleID: parseInt(formData.RoleID)
        }

        try {
            const response = await fetch(`${ApiResponse}users`, {
                method: 'POST',
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
            navigate('/admin/account');
        } catch (error) {
            console.error('Error creating account:', error);
            setError('Failed to create account. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Create Account</div>
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

                            <FormGroup
                                label={'Email'}
                                inputType={'email'}
                                inputName={'Email'}
                                value={formData.Email}
                                onChange={handleChange}
                            />
                            {validationErrors.Email && <div className="error">{validationErrors.Email}</div>}

                            <FormGroup
                                label={'Phone'}
                                inputType={'text'}
                                inputName={'Phone'}
                                value={formData.Phone}
                                onChange={handleChange}
                            />
                            {validationErrors.Phone && <div className="error">{validationErrors.Phone}</div>}

                            <FormGroup
                                label={'Address'}
                                inputType={'text'}
                                inputName={'Address'}
                                value={formData.Address}
                                onChange={handleChange}
                            />
                            {validationErrors.Address && <div className="error">{validationErrors.Address}</div>}


                            <div className="form-group">
                                <label>Role</label>
                                <select value={formData.RoleID} onChange={handleChange} className='form-control' required name="RoleID">
                                    <option value="" hidden>Select Role</option>
                                    {roleData && Array.isArray(roleData.data) && roleData.data.map((role) => (
                                        <option key={role.ID} value={role.ID}>{role.Name}</option>
                                    ))}
                                </select>
                                {validationErrors.RoleID && <div className="error">{validationErrors.RoleID}</div>}
                            </div>
                            
                            <div className="form-group mb-input">
                                <label>Faculty</label>
                                <select value={formData.FacultyID} onChange={handleChange} className='form-control' name="FacultyID">
                                    <option value="" hidden>Select Faculty</option>
                                    {facultyData && Array.isArray(facultyData.data) && facultyData.data.map((faculty) => (
                                        <option key={faculty.ID} value={faculty.ID}>{faculty.Name}</option>
                                    ))}
                                </select>
                                {validationErrors.FacultyID && <div className="error">{validationErrors.FacultyID}</div>}
                            </div>

                            <div className="form-action">
                                <button type="submit" onClick={handleBack} className="btn">Cancel</button>
                                <button type="submit" className="btn" disabled={!isFormValid}>Create</button>
                            </div>
                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default CreateAccount;
