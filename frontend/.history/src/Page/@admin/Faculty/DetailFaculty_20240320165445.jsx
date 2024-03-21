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

    const handleBack = () => {
        navigate('/admin/faculty');
    }

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Detail faculty</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content">
                        <form>
                            <div className="form-group">
                                <label>Name</label>
                                <input type="text" className='form-control' required name="name" value={formData.name} />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea required name="description" cols="30" rows="10" value={formData.description}></textarea>
                            </div>

                            <div className="form-group mb-input">
                                <label>Guest</label>
                                <select value={formData.guest} className='form-control' required name="guest">
                                    <option value="" hidden>Select Guest</option>
                                    <option value={true}>True</option>
                                    <option value={false}>False</option>
                                </select>
                            </div>

                            <div className="form-group mb-input">
                                <label>Guest</label>
                                <input type="text" className='form-control' readOnly value={formData.guest} />
                            </div>

                            <div className="form-action">
                                <button type="submit" onClick={handleBack} className="btn">Cancel</button>
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
