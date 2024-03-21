import React from 'react';

const Search = ({ placeholder, onChange }) => {
    return (
        <div className="search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input 
                type="text" 
                className="custom-input" 
                placeholder={`Search ${placeholder}`} 
                onChange={onChange} 
            />
        </div>
    );
}

export default Search;
