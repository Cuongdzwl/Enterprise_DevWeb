import React, { useState, useEffect } from 'react';
import FormInput from '../../../components/FormInput'; // Assuming FormInput is a custom component
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: 0,
        faculty: 0
    });
    const [isFormFilled, setIsFormFilled] = useState(false);

    const navigate = useNavigate();

    const { data: roleData } = useFetch('http://localhost:3000/role', { method: 'GET' });
    const { data: facultyData } = useFetch('http://localhost:3000/faculty', { method: 'GET' });

    useEffect(() => {
        setIsFormFilled(Object.values(formData).every(value => value !== ''));
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        

        try {
            const response = await fetch('http://localhost:3000/account', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error('Failed to create account');
            }
            navigate(-1);
        } catch (error) {
            console.error('Error creating account:', error);
        }
    };

    return (
        <div className="box">
            <div className="box-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className='form-control' required name="name" value={formData.name} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className='form-control' required name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" className='form-control' required name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" className='form-control' required name="address" value={formData.address} onChange={handleChange} />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select value={formData.role} onChange={handleChange} className='form-control' required name="role">
                            <option value="" hidden>Select Role</option>
                            {roleData && roleData.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Faculty</label>
                        <select value={formData.faculty} onChange={handleChange} className='form-control' required name="faculty">
                            <option value="" hidden>Select Faculty</option>
                            {facultyData && facultyData.map((faculty) => (
                                <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-action">
                        <button type="submit" className="btn">Cancel</button>
                        <button type="submit" disabled={!isFormFilled} className="btn">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;
