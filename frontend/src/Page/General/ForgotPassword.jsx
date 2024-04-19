import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo1 from '../../../public/logo1.png';
import { ApiResponse } from '../../Api';

const Data = { email: '' };

const ForgotPassword = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Validate form
    const isFormValid = Object.values(validationErrors).every(error => !error) &&
        Object.values(formData).every(value => value !== '');

    const validateField = (name, value) => {
        const errorMessage = {
            email: /\S+@\S+\.\S+/.test(value) ? '' : 'Email requires @ and no other special characters.',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return setError("Please fill in all fields correctly.");

        try {
            const response = await fetch(`${ApiResponse}auth/password/forgot?email=${formData.email}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.e.message);
                return;
            }
            setMessage('Please Check your email to reset your password.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);

        } catch (error) {
            console.error('Error forgot password in: ', error);
            setError('An error occurred while forgot password in. Please try again later.');
        }
    };

    return (
        <div className="login-1">
            <div className="logo">
                <img src={Logo1} alt="" />
            </div>
            <div className="login-form">
                <div className="login-box">
                    <h2>Forgot Password</h2>
                    <form onSubmit={handleSubmit} className="form-login">
                        <div className="input-box">
                            <label>Email</label>
                            <input type="email" required name="email" value={formData.email} onChange={handleChange} autoComplete='auto' placeholder="Enter your email" />
                        </div>
                        {validationErrors.email && <div className="error">{validationErrors.email}</div>}
                        <div className="form-submit">
                            {error && <div className="error">{error}</div>}
                            {message && <div className="error">{message}</div>}
                            <button type="submit" className="btn-login">SEND</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
