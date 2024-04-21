const FormGroup = ({ label, inputType, inputName, value, readOnly, onChange, addClass }) => {
    return (
        <div className="form-group">
            <label>{label}</label>
            <input
                type={inputType}
                className={`form-control ${addClass}`}
                name={inputName}
                value={value}
                readOnly={readOnly}
                onChange={onChange}
            />
        </div>
    );
};

export default FormGroup;
