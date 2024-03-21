import { useState, useEffect } from 'react';
import FormInput from '../../../components/FormInput';
import useMultipleFetch from '../../../CustomHooks/useMultipleFetch';

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

    const { dataList: [roleData, facultyData] } = useMultipleFetch([
        'http://localhost:3000/role',
        'http://localhost:3000/faculty'
    ], []);

    useEffect(() => {
        const isAllFieldsFilled = Object.values(formData).every(value => value !== '');
        setIsFormValid(isAllFieldsFilled);
    }, [formData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData); // Fixed the typo in console.log
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
                        <button type="submit" disabled={!isFormValid} className="btn">Create</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAccount;
