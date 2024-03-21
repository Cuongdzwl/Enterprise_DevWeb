import Search from './Search';
import { useNavigate } from 'react-router-dom';

const Heading = ({ title, button, redirect }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (redirect && navigate) {
            navigate(redirect);
        }
    };

    return (
        <div className="row-1">
            <div className="header">
                <div className="title">List {title}</div>
            </div>
            <Search />
            <div className="create">
                <button className="custom-button" onClick={handleClick}>{button}</button>
            </div>
        </div>
    );
};

export default Heading;
