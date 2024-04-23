import ERRORPAGE from '../../../public/404.jpeg'

const Page404 = () => {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <img src={ERRORPAGE} alt="" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </div>
    );
}

export default Page404;
