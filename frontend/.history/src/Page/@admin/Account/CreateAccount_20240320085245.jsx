import React, { useState, useEffect } from 'react';
import FormInput from '../../../components/FormInput';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate } from 'react-router-dom';

const CreateAccount = () => {
    // const [formData, setFormData] = useState({
    //     name: '',
    //     email: '',
    //     phone: '',
    //     address: '',
    //     role: '',
    //     faculty: ''
    // });

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
        // const blog = { title, body, author };
        const formData = { name, email, phone, address, role, faculty };


        fetch('http://localhost:8000/blogs', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(blog)
        })
            .then(() => {
                console.log('new blog added');
                navigate('/');
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <div className="box">
            <div className="box-content">
                <form onSubmit={handleSubmit}>
                    <FormInput label="Name" type="text" name="name" value={formData.name} onChange={handleChange} />
                    <FormInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                    <FormInput label="Phone" type="text" name="phone" value={formData.phone} onChange={handleChange} />
                    <FormInput label="Address" type="text" name="address" value={formData.address} onChange={handleChange} />
                    <FormInput label="Role" type="select" name="role" options={roleData ? roleData.map(role => ({ value: role.name, label: role.description })) : []} value={formData.role} onChange={handleChange} placeholder="Select Role" />
                    <FormInput label="Faculty" type="select" name="faculty" options={facultyData ? facultyData.map(faculty => ({ value: faculty.name, label: faculty.description })) : []} value={formData.faculty} onChange={handleChange} placeholder="Select Faculty" />
                    <div className="form-action">
                        <button type="button" className="btn">Cancel</button>
                        <button type="submit" disabled={!isFormValid || isSubmitting} className="btn">{isSubmitting ? 'Creating...' : 'Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;
