import {useState} from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import useFetch from '../../../CustomHooks/useFetch';
import DocViewer, {DocViewerRenderers} from "@cyntler/react-doc-viewer";
import { ApiResponse } from '../../../Api';

const DetailContributionPM = () => {
    // State
    const [isActive, setIsActive] = useState(false);
    const navigate = useNavigate();
    const {id} = useParams();

    // Fetch data
    const { data: contribution } = useFetch(`${ApiResponse}contributions/${id}?depth=1&file=true`);
    const EventID = contribution?.EventID

    var textFile = contribution?.TextFiles[0]?.Url
    var imageFile = contribution?.ImageFiles[0]?.Url

    const docs = [{uri: `${textFile}`},];

    const splitFiles = (str) => {
        const files = str?.split('/');
        return files?.[files?.length - 1]
    }

    // Handle event
    const handleClose = () => {
        setIsActive(false);
    }

    const handleDownload = (fileID) => {
        return async () => {
            try {
                const response = await fetch(`${ApiResponse}contributions/${fileID}/download`, {
                    method: 'GET',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to download contribution');
                }
                const blob = await response.blob();
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'file.zip');
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleOpen = (e) => {
        e.preventDefault()
        setIsActive(true);
    }

    const handleBack = () => {
        navigate(`/manager/public/${EventID}`)
    }

    return (<div className="box">
        <div className={`view-file ${isActive ? 'active' : ''}`}>
            <DocViewer documents={docs} pluginRenderers={DocViewerRenderers}/>
            <div className="close-file-btn">
                <button className='close-file' onClick={handleClose}>Close</button>
            </div>
        </div>
        <div className="row-1">
            <div className="header">
                <div className="title">Detail Contribution</div>
            </div>
        </div>
        <div className="row-2">
            <div className="box">
                <div className="box-content contribution coodinator manager">
                    <form
                    style={{width: '45%'}}
                    >
                        <div className="form-group">
                            <label>Name</label>
                            <input type="text" name="name" value={contribution?.Name} readOnly={true}
                                   className="form-control"/>
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea name="" value={contribution?.Content} readOnly={true} id="" cols="30"
                                      rows="10"></textarea>
                        </div>

                        <div className="form-group mb-input">
                            <label>File</label>
                            <div
                                style={{display: 'flex'}}
                            >
                                <input type="text" style={{width: '85%'}} name="name" id="name" readOnly={true}
                                       value={splitFiles(textFile) ?? null}
                                       className="form-control"/>
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
                                    <a href=''
                                       style={{
                                           padding: '0 14px',
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
                                 backgroundImage: `url(${imageFile})`,
                                 backgroundRepeat: 'no-repeat',
                                 backgroundSize: 'cover',
                             }}
                        >
                        </div>
                        <button onClick={handleDownload(contribution?.ID)} className="download">Download</button>
                    </div>
                </div>
            </div>
        </div>
    </div>);
};

export default DetailContributionPM;
