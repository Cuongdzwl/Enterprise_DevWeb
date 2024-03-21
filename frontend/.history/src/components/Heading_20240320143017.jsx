import Search from './Search';
import { useNavigate } from 'react-router-dom';

// eslint-disable-next-line react/prop-types
const Heading = ({ title, button, redirect, showSearch, showCreate }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        if (redirect && showCreate) {
            navigate(redirect);
        }
    };

    return (
        <div className="row-1">
            <div className="header">
                <div className="title">{title}</div>
            </div>
            {showSearch && <Search placeholder={placeholder} />}
            {showCreate && (
                <div className="create">
                    <button className="custom-button" onClick={handleClick}>{button}</button>
                </div>
            )}
        </div>
    );
};

export default Heading;