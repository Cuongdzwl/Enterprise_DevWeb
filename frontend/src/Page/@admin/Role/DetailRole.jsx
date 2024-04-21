import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';
import FormGroup from '../../../components/FormGroup';
import Loading from '../../../components/Loading';
import { ApiResponse } from '../../../Api';

const Data = {
    Name: '',
    Description: '',
}

const DetailRole = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [error] = useState(null);

    // ID, Redirect
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch data
    const { data: role } = useFetch(`${ApiResponse}roles/${id}`);

    // Set form data
    useEffect(() => {
        if (role) {
            setFormData(role);
        }
    }, [role]);

    // Handle Event
    const handleBack = () => {
        navigate('/admin/role');
    }

    if (!role) {
        return (
            <Loading />
        )
    }

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Detail role</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box"
                    style={{
                        height: 'calc(100vh - 150px)'
                    }}
                >
                    <div className="box-content">
                        <form>
                            <FormGroup
                                label={'Name'}
                                inputType={'text'}
                                inputName={'Name'}
                                value={formData?.Name}
                            />

                            <div className="form-group">
                                <label>Description</label>
                                <textarea required name="Description" readOnly cols="30" rows="10"
                                    value={formData?.Description}></textarea>
                            </div>

                            <div className="form-action">
                                <button type="submit" onClick={handleBack} className="btn">Back</button>
                            </div>
                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailRole;
