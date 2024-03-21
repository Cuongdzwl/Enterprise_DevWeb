import Search from './Search';

const Heading = ({ title, button }) => {
    
    const handleC

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