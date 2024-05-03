import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Loading from '../../../components/Loading';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";

const DetailContributionG = () => {
    // State
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch data
    const location = useLocation();
    const contribution = location.state;

    if (!contribution) {
        return (
            <Loading />
        )
    }

    // Handle Event
    const handleBack = () => {
        navigate('/guest/public/')
    }

    const handleClose = () => {
        setIsActive(false);
    }

    const handleOpen = (e) => {
        e.preventDefault()
        setIsActive(true);
    }

    // Get detail contribution
    const oneContribution = contribution.filter((item) => {
        if (item?.ID == id) {
            return item
        }

    })

    const item = oneContribution[0];

    // Classify doc files and images
    const filteredData = {
        ...item,
        ImageFiles: item.Files.filter(file =>
            file.Url.endsWith('.png') ||
            file.Url.endsWith('.jpeg') ||
            file.Url.endsWith('.JPG') ||
            file.Url.endsWith('jpg')),
        TextFiles: item.Files.filter(file => file.Url.endsWith('.docx'))
    };

    const image = filteredData.ImageFiles[0]?.Url;
    const text = filteredData.TextFiles[0]?.Url;

    const docs = [
        { uri: `${text}` },
    ];

    const splitFiles = (str) => {
        const files = str?.split('/');
        return files?.[files?.length - 1]
    }

    return (
        <div className="box">
            <div className={`view-file ${isActive ? 'active' : ''}`}>
                <DocViewer documents={docs} pluginRenderers={DocViewerRenderers} />
                <div className="close-file-btn">
                    <button className='close-file' onClick={handleClose}>Close</button>
                </div>
            </div>
            <div className="row-1">
                <div className="header">
                    <div className="title">Detail Public Contribution</div>
                </div>
            </div>
            <div className="row-2">
                <div className="box">
                    <div className="box-content contribution coodinator">
                        <form action="">
                            <div className="form-group">
                                <label>Name</label>
                                <input readOnly={true} value={filteredData.Name} className="form-control" />
                            </div>

                            <div className="form-group">
                                <label>Content</label>
                                <textarea readOnly={true} value={filteredData.Content} cols="30" rows="10"></textarea>
                            </div>

                            <div className="form-group mb-input">
                                <label>File</label>
                                <div
                                    style={{ display: 'flex' }}
                                >
                                    <input type="text" style={{ width: '85%' }} name="name" id="name" readOnly={true}
                                        value={splitFiles(text) ?? null}
                                        className="form-control" />
                                    <div className="download"
                                        style={{
                                            display: 'grid',
                                            placeItems: 'center',
                                            marginTop: '12px',
                                            borderRadius: '8px',
                                            background: '#F1F2F5',
                                            marginLeft: 'auto',
                                            width: '10%',
                                        }}
                                    >
                                        <a href='#'
                                            style={{
                                                padding: '10px',
                                                fontSize: '1.4rem',
                                            }}
                                            onClick={handleOpen}
                                        >
                                            <i className="fa-regular fa-eye">
                                            </i>
                                        </a>
                                    </div>
                                </div>

                            </div>


                            <div className="form-action">
                                <button type="button" onClick={handleBack} className="btn">Back</button>
                            </div>
                        </form>
                        <div className="form-group update">
                            <label>Image</label>
                            <div className="image-preview"
                                style={{
                                    backgroundImage: `url(${image ?? null})`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundSize: 'cover',
                                }}
                            >
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailContributionG;
