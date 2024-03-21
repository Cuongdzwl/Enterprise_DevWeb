import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';

const DetailFaculty = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        guest: false
    });
    const [isLoading] = useState(false);
    const [error] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    const { data: faculty } = useFetch('http://localhost:3000/faculty/' + id);

    useEffect(() => {
        if (faculty) {
            const { name, description, guest } = faculty;
            setFormData({ name, description, guest });
        }
    }, [faculty]);



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleClick = () => {
        navigate('/admin/account');
    }

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">List Account</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content">
                        <form>
                            <div className="form-group">
                                <label>Name</label>
                                <input readOnly type="text" className='form-control' value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input readOnly type="email" className='form-control' name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input readOnly type="text" className='form-control' name="phone" value={formData.phone} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input readOnly type="text" className='form-control' name="address" value={formData.address} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Role</label>
                                <input type="text" className='form-control' readOnly value={getRoleName(formData.role)} />
                            </div>
                            <div className="form-group mb-input">
                                <label>Faculty</label>
                                <input type="text" className='form-control' readOnly value={getFacultyName(formData.faculty)} />
                            </div>

                            <div className="form-action">
                                <button type="button" className="btn" onClick={handleClick}>Back</button>
                            </div>
                            {isLoading && <span>Loading...</span>}
                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailFaculty;
