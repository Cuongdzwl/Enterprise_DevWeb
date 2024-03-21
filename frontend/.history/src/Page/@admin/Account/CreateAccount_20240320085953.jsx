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
                    <FormInput label="Name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
                    <FormInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <FormInput label="Phone" type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    <FormInput label="Address" type="text" value={address} onChange={(e) => setAddress(e.target.value)} />
                    <FormInput label="Role" type="select" options={roleData ? roleData.map(role => ({ value: role.name, label: role.description })) : []} value={role} onChange={(e) => setRole(e.target.value)} placeholder="Select Role" />
                    <FormInput label="Faculty" type="select" name="faculty" options={facultyData ? facultyData.map(faculty => ({ value: faculty.name, label: faculty.description })) : []} value={faculty} onChange={(e) => setFaculty(e.target.value)} placeholder="Select Faculty" />
                    <div className="form-action">
                        <button type="button" className="btn">Cancel</button>
                        <button type="submit" className="btn">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;
