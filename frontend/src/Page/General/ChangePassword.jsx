import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormGroup from '../../components/FormGroup';
import { ApiResponse } from '../../Api';

const Data = {
    oldPassword: '',
    newPassword: '',
    ConfirmPassword: '',
};

const ChangePassword = () => {
    const navigate = useNavigate();
    const [isFormValid, setIsFormValid] = useState(false);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [confirmPassword, setConfirmPassword] = useState('');

    // State
    const [formData, setFormData] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Validate form
    useEffect(() => {
        setIsFormValid(Object.values(validationErrors).every(error => error === '') && formData.newPassword === confirmPassword);
    }, [validationErrors, formData, confirmPassword]);

    const validateField = (name, value) => {
        let errorMessage = '';
        switch (name) {
            case 'oldPassword':
                errorMessage = value.trim() && /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/.test(value) ? '' : 'Password must be at least 8 characters with letters and numbers.';
                break;
            case 'newPassword':
                errorMessage = value.trim() && /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/.test(value) ? '' : 'Password must be at least 8 characters with letters and numbers.';
                break;
            case 'ConfirmPassword':
                errorMessage = value === formData.newPassword ? '' : 'Passwords do not match.';
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

    const handleBack = () => {
        navigate('/profile');
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
            oldPassword: formData.oldPassword,
            newPassword: formData.newPassword
        };

        try {
            const response = await fetch(`${ApiResponse}auth/password/change`, {
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
            navigate('/profile');
        } catch (error) {
            console.error('Error change password:', error);
            setError('Failed to change password. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Change Password</div>
                </div>
            </div>

            <div className="row-2">
                <div className="box"
                    style={{
                        height: 'calc(100vh - 150px)'
                    }}
                >
                    <div className="box-content">
                        <form onSubmit={handleSubmit}>
                            <FormGroup
                                label={'Current Password'}
                                inputType={'password'}
                                inputName={'oldPassword'}
                                value={formData.oldPassword}
                                onChange={handleChange}
                            />
                            {validationErrors.oldPassword &&
                                <div className="error">{validationErrors.oldPassword}</div>}

                            <FormGroup
                                label={'New Password'}
                                inputType={'password'}
                                inputName={'newPassword'}
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                            {validationErrors.newPassword &&
                                <div className="error">{validationErrors.newPassword}</div>}

                            <FormGroup
                                label={'Confirm Password'}
                                inputType={'password'}
                                inputName={'ConfirmPassword'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            {validationErrors.ConfirmPassword &&
                                <div className="error">{validationErrors.ConfirmPassword}</div>}

                            <div className="form-action">
                                <button type="button" onClick={handleBack} className="btn">Cancel</button>
                                <button type="submit" className="btn">Update</button>
                            </div>
                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;
