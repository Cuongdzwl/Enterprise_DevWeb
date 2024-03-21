import { useState, useEffect } from 'react';
import FormInput from '../../../components/FormInput';
import useFetch from '../../../CustomHooks/useFetch';


const CreateAccount = () => {
    const { data: role, error } = useFetch('http://localhost:3000/role', { method: 'GET' });
    const { data: faculty, error1 } = useFetch('http://localhost:3000/faculty', { method: 'GET' });

    const [roles, setRoles] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        faculty: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const blog = { title, body, author };

        setIsPending(true);

        fetch('http://localhost:3000/account', {
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
        <>
            <div className="box">
                <div className="box-content">
                    <form onSubmit={handleSubmit}>
                        <FormInput label="Name" type="text" name="name" value={formData.name} onChange={handleChange} />
                        <FormInput label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                        <FormInput label="Phone" type="text" name="phone" value={formData.phone} onChange={handleChange} />
                        <FormInput label="Address" type="text" name="address" value={formData.address} onChange={handleChange} />
                        <FormInput label="Role" type="select" name="role" options={roles} value={formData.role} onChange={handleChange} placeholder="Select Role" />
                        <FormInput label="Faculty" type="select" name="faculty" options={faculties} value={formData.faculty} onChange={handleChange} placeholder="Select Faculty" />
                        <div className="form-action">
                            <button type="submit" className="btn">Cancel</button>
                            <button type="submit" disabled={!isFormValid} className="btn">Create</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default CreateAccount;