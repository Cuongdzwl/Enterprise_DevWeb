import React, { useState, useEffect } from 'react';
import FormInput from '../../../components/FormInput'; // Assuming FormInput is a custom component
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [role, setRole] = useState('');
    const [faculty, setFaculty] = useState('');

    const navigate = useNavigate();

    const { data: roleData } = useFetch('http://localhost:3000/role', { method: 'GET' });
    const { data: facultyData } = useFetch('http://localhost:3000/faculty', { method: 'GET' });

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = { name, email, phone, address, role, faculty };
        console.log(formData);

        // Implement form submission logic here (e.g., API calls, validation)
    };

    return (
        <div className="box">
            <div className="box-content">
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text"
                            className='form-control'
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email"
                            className='form-control'
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <div className="form-action">
                            <button diabled class="btn">Create</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;
