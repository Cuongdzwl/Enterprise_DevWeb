import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ApiResponse } from '../../Api';
import Logo1 from '../../../public/logo1.png';

const Data = {
    email: '',
    password: ''
}

const LoginAM = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const navigate = useNavigate();

    // Validate form
    const isFormValid = Object.values(validationErrors).every(error => !error) &&
        Object.values(formData).every(value => value !== '');

    const validateField = (name, value) => {
        const errorMessage = {
            email: /\S+@\S+\.\S+/.test(value) ? '' : 'Email requires @ and no other special characters.',
            password: /(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}/.test(value) ? '' : 'Password must be at least 8 characters with letters and numbers.'
        }[name];
        setValidationErrors(prevState => ({ ...prevState, [name]: errorMessage }));
    }

    useEffect(() => {
        isFormValid && setError(null);
    }, [isFormValid]);

    // Handle Event
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
        validateField(name, value);
    };

    const handleBack = () => navigate('/login');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return setError("Please fill in all fields correctly.");
        const newFormData = { ...formData, FacultyID: parseInt(formData.FacultyID) };
        try {
            const response = await fetch(`${ApiResponse}auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newFormData)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify(data.user));
                const roleID = data.user.RoleID;
                const rolePaths = {
                    1: '/admin/dashboard',
                    2: '/manager/dashboard',
                };

                const rolePath = rolePaths[roleID];
                if (rolePath) {
                    navigate(rolePath);
                } else {
                    setError('Unknown role.');
                }
                window.location.reload();

            } else {
                setError(data.message.message);
            }
        } catch (error) {
            console.error('Error logging in: ', error);
            setError('An error occurred while logging in. Please try again later.');
        }
    };

    return (
        <div className="login-staff">
            <div className="header">
                <div className="logo-1">
                    <img src={Logo1} alt="" />
                </div>
                <div className="heading">
                    <h1>FPT Education Organization</h1>
                </div>
            </div>
            <div className="content">
                <div className="title">
                    <h2>Login with account and password</h2>
                </div>
                <form onSubmit={handleSubmit} className="form-staff">
                    <div className="box">
                        <div className="input-box">
                            <label>Email</label>
                            <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email" />
                            {validationErrors.email && <div className="error">{validationErrors.email}</div>}
                        </div>
                        <div className="input-box">
                            <label>Password</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
                            {validationErrors.password && <div className="error">{validationErrors.password}</div>}
                        </div>
                        <div className="button-staff">
                            <button type="button" className="btn" onClick={handleBack}>Back</button>
                            <button type="submit" className="btn" disabled={!isFormValid} >
                                Login
                            </button>
                        </div>
                        {error && <div className="error">{error}</div>}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginAM;
