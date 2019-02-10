import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const InputGroup = (
    {name, placeholder, value, error, icon, type, onChange}) => {
    return (
        <div className="input-group mb-3">
            <div className="input-group-prepend">
                <span className="input-group-text">
                    <i className={ icon }/>
                </span>
            </div>
            <input
                className={classNames("form-control form-control-lg", {
                    'is-invalid': error
                })}
                value={ value }
                onChange={(event) => onChange(event)}
                placeholder={ placeholder }
                name={ name }
            />
            {error ? (
                <div className="invalid-feedback">{error}</div>
            ) : null}
        </div>
    );
};

InputGroup.propTypes = {

    name: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string.isRequired,
    icon: PropTypes.string,
    type: PropTypes.string.isRequired,
    error: PropTypes.string,
    onChange: PropTypes.func.isRequired,
};

InputGroup.defaultProps = {
    type: 'text'
};

export default InputGroup;