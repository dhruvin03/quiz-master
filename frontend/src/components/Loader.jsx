const Loader = ({ message = "Loading..." }) => {
    return (
        <div className="container py-5">
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: '50vh' }}>
                <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                </div>
                <h4 className="text-muted">{message}</h4>
            </div>
        </div>
    );
};

export default Loader;
