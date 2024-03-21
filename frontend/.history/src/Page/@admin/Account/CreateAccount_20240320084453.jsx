import React, { useState, useEffect } from 'react';
import FormInput from '../../../components/FormInput';
import useFetch from '../../../CustomHooks/useFetch';

const CreateAccount = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        faculty: ''
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const { data: roleData } = useFetch('http://localhost:3000/role', { method: 'GET' });
    const { data: facultyData } = useFetch('http://localhost:3000/faculty', { method: 'GET' });

    useEffect(() => {
        // Kiểm tra tính hợp lệ của form mỗi khi giá trị trong formData thay đổi
        const isAnyFieldEmpty = Object.values(formData).some(value => value === '');
        setIsFormValid(!isAnyFieldEmpty);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(`Field ${name} has new value: ${value}`);
        setFormData((prevFormData) => {
            const updatedFormData = { ...prevFormData, [name]: value };
            console.log('Updated formData:', updatedFormData);
            return updatedFormData;
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Submitted data:', formData);
    };

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
                        <button type="submit" className="btn">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;
