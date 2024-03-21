import Search from './Search';
import { Navigate } from 'react-router-dom';

const Heading = ({ title, button }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if
        navigate('/admin/account/create');
    }

    return (
        <div className="row-1">
            <div className="header">
                <div className="title">List {title}</div>
            </div>
            <Search />
            <div className="create">
                <button className="custom-button">{button }</button>
            </div>
        </div>
    );
}

export default Heading;