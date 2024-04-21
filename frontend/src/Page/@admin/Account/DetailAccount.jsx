import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';
import FormGroup from '../../../components/FormGroup';
import Loading from '../../../components/Loading';
import { ApiResponse } from '../../../Api';

const Data = {
    Name: '',
    Email: '',
    Phone: '',
    Address: '',
    RoleID: '',
    FacultyID: ''
}

const DetailAccount = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isLoading] = useState(false);
    const [error] = useState(null);

    // ID and Redirect
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch data
    const { data: account } = useFetch(`${ApiResponse}users/${id}?depth=1`);

    // Set Data
    useEffect(() => {
        if (account) {
            setFormData(account);
        }
    }, [account]);

    // Handle Event
    const handleClick = () => {
        navigate('/admin/account');
    }

    if (!account) {
        return (
            <Loading />
        )
    }

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Detail Account</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content">
                        <form>
                            <FormGroup
                                label={'Name'}
                                inputType={'text'}
                                inputName={'Name'}
                                value={formData.Name}
                                readOnly={true}
                            />

                            <FormGroup
                                label={'Email'}
                                inputType={'email'}
                                inputName={'Email'}
                                value={formData.Email}
                                readOnly={true}
                            />

                            <FormGroup
                                label={'Phone'}
                                inputType={'text'}
                                inputName={'Phone'}
                                value={formData.Phone}
                                readOnly={true}
                            />

                            <FormGroup
                                label={'Address'}
                                inputType={'text'}
                                inputName={'Address'}
                                value={formData.Address}
                                readOnly={true}
                            />

                            <div className="form-group">
                                <label>Role</label>
                                <input type="text" className='form-control' readOnly value={account?.Role?.Name} />
                            </div>
                            <div className="form-group mb-input">
                                <label>Faculty</label>
                                <input type="text" className='form-control' readOnly value={account?.Faculty?.Name} />
                            </div>

                            <div className="form-action">
                                <button type="button" className="btn" onClick={handleClick}>Back</button>
                            </div>
                            {isLoading && <Loading />}
                            {error && <div className="error">{error}</div>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailAccount;
