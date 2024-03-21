import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';

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
    const { id } = useParams();

    const { data: account } = useFetch(`http://localhost:3000/account/${id}`);
    const { data: roleData } = useFetch('http://localhost:3000/role');
    const { data: facultyData } = useFetch('http://localhost:3000/faculty');

    useEffect(() => {
        if (account) {
            const { name, email, phone, address, role, faculty } = account;
            setFormData({ name, email, phone, address, role, faculty });
        }
    }, [account]);

    const handleClick = () => {
        navigate('/admin/account');
    }

    return (
        <div className="box">
            <div className="box-content">
                <form>
                    <div className="form-group">
                        <label>Name</label>
                        <input readOnly type="text" className='form-control' value={formData.name} />
                    </div>
                    <div className="form-group">
                        <label>Email</label>
                        <input readOnly type="email" className='form-control' name="email" value={formData.email} />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input readOnly type="text" className='form-control' name="phone" value={formData.phone} />
                    </div>
                    <div className="form-group">
                        <label>Address</label>
                        <input readOnly type="text" className='form-control' name="address" value={formData.address} />
                    </div>
                    <div className="form-group">
                        <label>Role</label>
                        <select value={formData.role} className='form-control' name="role">
                            <option value="" hidden>Select Role</option>
                            {roleData && roleData.map((role) => (
                                <option key={role.id} value={role.id}>{role.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group mb-input">
                        <label>Faculty</label>
                        <select value={formData.faculty} className='form-control' name="faculty">
                            <option value="" hidden>Select Faculty</option>
                            {facultyData && facultyData.map((faculty) => (
                                <option key={faculty.id} value={faculty.id}>{faculty.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-action">
                        <button type="button" className="btn" onClick={handleClick}>Back</button>
                    </div>
                    {isLoading && <span>Loading...</span>}
                    {error && <div className="error">{error}</div>}
                </form>
            </div>
        </div>
    );
};

export default DetailAccount;
