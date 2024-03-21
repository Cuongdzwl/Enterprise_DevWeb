import React from 'react';
import useFetch from '../../../CustomHooks/useFetch';
import TableHead from '../../../components/TableHead';
import Skeleton from 'react-loading-skeleton'; // Import Skeleton từ thư viện react-loading-skeleton

const headings = ["Name", "Description", "Number Event", "Guest", "Action"];

const ListAccount = () => {
    const { data, error } = useFetch('http://localhost:3000/account');

    if (error) {
        return <p>Error fetching data: {error.message}</p>;
    }

    // Sử dụng Skeleton để hiển thị placeholder trong quá trình tải dữ liệu
    if (!data) {
        return (
            <div className="box">
                <table>
                    <thead>
                        <TableHead headings={headings} />
                    </thead>
                    <tbody>
                        {/* Sử dụng Skeleton để tạo placeholder cho mỗi hàng trong bảng */}
                        <tr>
                            {headings.map((heading, index) => (
                                <td key={index}>
                                    <Skeleton />
                                </td>
                            ))}
                        </tr>
                        {/* Hiển thị nhiều placeholder tùy thuộc vào số lượng hàng bạn muốn */}
                        {[...Array(5)].map((_, index) => (
                            <tr key={index}>
                                {headings.map((_, index) => (
                                    <td key={index}>
                                        <Skeleton />
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    return (
        <div className="box">
            <table>
                <thead>
                    <TableHead headings={headings} />
                </thead>
                <tbody>
                    {data.map((row) => (
                        <tr key={row.id}>
                            <td>{row.Name}</td>
                            <td className="description" style={{ maxWidth: "208.78px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{row.Content}</td>
                            <td className="number-event">{row.Number}</td>
                            <td>
                                <span className={`guest-status ${row.Status === "Yes" ? "active" : ""}`}>{row.Status}</span>
                            </td>
                            <td colSpan="2">
                                <ul className="menu-action">
                                    <li><a href=""><i className="fa-solid fa-circle-info"></i></a></li>
                                    <li><a href=""><i className="fa-solid fa-pen-to-square"></i></a></li>
                                    <li><a href=""><i className="fa-solid fa-trash"></i></a></li>
                                </ul>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListAccount;
