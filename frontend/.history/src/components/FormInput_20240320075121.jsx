const FormInput = () => {
    return (
        const FormInput = ({ label, type, name, options = [], placeholder = '' }) => (
            <div className="form-group">
                <label htmlFor={name}>{label}</label>
                {type === 'select' ? (
                    <select name={name} className="form-control">
                        <option value="" hidden>{placeholder}</option>
                        {options.map((option, index) => (
                            <option key={index} value={option.value}>{option.label}</option>
                        ))}
                    </select>
                ) : (
                    <input type={type} name={name} className="form-control" placeholder={placeholder} />
                )}
            </div>
        );
      );
}

export default FormInput;