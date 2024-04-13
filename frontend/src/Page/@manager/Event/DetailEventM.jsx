import { useState, useEffect } from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import { useNavigate, useParams } from 'react-router-dom';
import FormGroup from '../../../components/FormGroup';
import { Link } from 'react-router-dom';
import { ApiResponse } from '../../../Api';
import Loading from '../../../components/Loading';

const Data = {
    Name: '',
    Description: '',
    ClosureDate: '',
    FinalDate: ''
}

const DetailEventM = () => {
    // State
    const [formData, setFormData] = useState(Data);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch data
    const { data: event } = useFetch(`${ApiResponse}events/${id}?depth=1`);

    //Set Data
    useEffect(() => {
        if (event) {
            setFormData(event);
        }
    }, [event]);

    // Handle Event
    const handleBack = () => {
        navigate('/manager/event')
    }

    const handleSubmit = () => {
        navigate(`/manager/public/${id}`);
    }

    if (!event) {
        return <Loading />;
    }

    // Format Date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const options = {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true
        };
        return date.toLocaleDateString('en-US', options);
    };

    return (
        <div className="box">
            <div className="row-1">
                <div className="header">
                    <div className="title">Detail event</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content">
                        <form>
                            <FormGroup
                                label="Name"
                                inputType="text"
                                inputName="Name"
                                value={formData.Name}
                                readOnly={true}
                            />

                            <div className="form-group">
                                <label>Description</label>
                                <div className='detail-ck-editor' dangerouslySetInnerHTML={{ __html: formData.Description }} />
                            </div>

                            <div className="flex-row mb-input">

                                <FormGroup
                                    label="Closure Date"
                                    inputType="text"
                                    inputName="ClosureDate"
                                    value={formatDate(formData.ClosureDate)}
                                    readOnly={true}
                                    addClass="input-date"
                                />

                                <FormGroup
                                    label="Due Date"
                                    inputType="text"
                                    inputName="FinalDate"
                                    value={formatDate(formData.FinalDate)}
                                    readOnly={true}
                                    addClass="input-date"
                                />
                            </div>

                            <div className="form-action">
                                <button type="submit" onClick={handleBack} className="btn">Back</button>
                                <button type='button' onClick={handleSubmit} className="btn">View List Contribution</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailEventM;
