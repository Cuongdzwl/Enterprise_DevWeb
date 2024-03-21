const tHead = {
    name: "Name",
    description: "Description",
    numberEvent: "Number Event",
    guest: "Guest",
    action: "Action",
};

const ListAccount = () => {
    return (
        <div className="box">
            <table>
                <thead>
                    <tr>
                        {Object.entries(tHead).map(([key, value]) => (
                            <th key={key} colSpan="1">
                                {value}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan="1">Nguyen Van A</td>
                        <td colSpan="1">Day la khoa A</td>
                        <td colSpan="1" style={{ textAlign: "center" }}>
                            4
                        </td>
                        <td>
                            <span className="guest-status">No</span>
                        </td>
                        <td colSpan="2">
                            <ul className="menu-action">
                                <li>
                                    <a href="">
                                        <i className="fa-solid fa-circle-info"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </a>
                                </li>
                                <li>
                                    <a href="">
                                        <i className="fa-solid fa-trash"></i>
                                    </a>
                                </li>
                            </ul>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};


export default ListAccount;