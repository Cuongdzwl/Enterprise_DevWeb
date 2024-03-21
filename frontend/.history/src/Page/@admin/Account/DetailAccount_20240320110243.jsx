import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate } from 'react-router-dom';

const DetailAccount = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        role: '',
        faculty: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const { data: roleData} = useFetch('http://localhost:3000/role');
    const { data: facultyData } = useFetch('http://localhost:3000/faculty');

    return (
        <div className="box">
            <div className="box-content">
                <form onSubmit=}>
                    <div className="form-group">
                        <label>Name</label>
                        <input type="text" className='form-control' required name="name" value={formData.name} onChange={handleChange} />
                        {validationErrors.name && <div className="error">{validationErrors.name}</div>}
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" className='form-control' required name="email" value={formData.email} onChange={handleChange} />
                        {validationErrors.email && <div className="error">{validationErrors.email}</div>}
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input type="text" className='form-control' required name="phone" value={formData.phone} onChange={handleChange} />
                        {validationErrors.phone && <div className="error">{validationErrors.phone}</div>}
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input type="text" className='form-control' required name="address" value={formData.address} onChange={handleChange} />
                        {validationErrors.address && <div className="error">{validationErrors.address}</div>}
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select value={formData.role} onChange={handleChange} className='form-control' required name="role">
                            <option value="" hidden>Select Role</option>
                            {roleData && roleData.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                        {validationErrors.role && <div className="error">{validationErrors.role}</div>}
                    </div>
                    <div className="form-group mb-input">
                        <label>Faculty</label>
                        <select value={formData.faculty} onChange={handleChange} className='form-control' required name="faculty">
                            <option value="" hidden>Select Faculty</option>
                            {facultyData && facultyData.map((faculty) => (
                                <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                            ))}
                        </select>
                        {validationErrors.faculty && <div className="error">{validationErrors.faculty}</div>}
                    </div>

                    <div className="form-action">
                        <button type="submit" className="btn">Cancel</button>
                        <button type="submit" disabled={!isFormValid || isLoading} className="btn">Create</button>
                    </div>
                    {isLoading && <span>Loading...</span>}
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default DetailAccount;
