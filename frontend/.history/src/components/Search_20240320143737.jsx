const Search = (placeholder) => {
    return (
        <div className="search">
            <i className="fa-solid fa-magnifying-glass"></i>
            <input type="text" className="custom-input" placeholder={placeholder} />
        </div>
    );
}

export default Search;