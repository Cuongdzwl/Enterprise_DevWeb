import PropTypes from 'prop-types';

const Search = ({ placeholder, value, onChange }) => {
    return (
        <div className="search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input
                type="text"
                className="custom-input"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}

Search.propTypes = {
    placeholder: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};

export default Search;
