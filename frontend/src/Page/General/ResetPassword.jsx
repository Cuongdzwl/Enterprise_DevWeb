import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo1 from '../../../public/logo1.png';
import useFetch from '../../CustomHooks/useFetch';
import { ApiResponse } from '../../Api';

const Data = { newPassword: '' };

const ResetPassword = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [validationErrors, setValidationErrors] = useState(Data);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // Validate form
    const isFormValid = Object.values(formData).every(value => value !== '');


    useEffect(() => {
        isFormValid && setError(null);
    }, [isFormValid]);

    // Handle Event
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const url = window.location.href;
    const tokenIndex = url.indexOf('?token=');
    if (tokenIndex !== -1) {
        var token = url.slice(tokenIndex + 7);
    } else {
        console.log('Not Found in URL');
    }



    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid) return setError("Please fill in all fields correctly.");

        try {
            const response = await fetch(`${ApiResponse}auth/password/reset?token=${token}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                setTimeout(()=>{
                    setMessage('Password reset successfully. Please login to continue.');
                })
                window.location.href = '/login'
            } else {
                setError(data.message.message);
            }
        } catch (error) {
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
                    <h2>Reset Password</h2>
                    <form onSubmit={handleSubmit} className="form-login">
                        <div className="input-box">
                            <label>New Password</label>
                            <input type="password" required name="newPassword" value={formData.newPassword} onChange={handleChange} autoComplete='auto' placeholder="Enter your password" />
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

export default ResetPassword;
