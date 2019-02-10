import React, {Component} from 'react';
import { connect } from 'react-redux';
import { registerUser } from "../../actions/authActions";
import PropTypes from 'prop-types'
import { withRouter } from "react-router-dom";
import TextFieldGroup from '../common/TextFieldGroup';

class Register extends Component {

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            email: '',
            password: '',
            password2: '',
            errors: {}
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name] : e.target.value })
    };

    onSubmit = (e) => {
        e.preventDefault();
        const newUser = {
            name: this.state.name,
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2
        };

        this.props.registerUser(newUser, this.props.history);
    };

    componentDidMount() {
        if(this.props.auth.isAuthenticated){
            this.props.history.push('/dashboard');
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            })
        }
    }

    render() {
        const { errors } = this.state;

        return (
            <div className="register">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Sign Up</h1>
                            <p className="lead text-center">Create your account</p>
                            <form onSubmit={this.onSubmit}>
                                <TextFieldGroup
                                    type="text"
                                    onChange={this.onChange}
                                    error={errors.name}
                                    value={this.state.name}
                                    name="name"
                                    placeholder="Name"
                                />

                                <TextFieldGroup
                                    type="email"
                                    onChange={this.onChange}
                                    error={errors.email}
                                    value={this.state.email}
                                    name="email"
                                    placeholder="Email"
                                    info="This site uses Gravatar so if you want a
                                        profile image, use a Gravatar email"
                                />

                                <TextFieldGroup
                                    type="password"
                                    onChange={this.onChange}
                                    error={errors.password}
                                    value={this.state.password}
                                    name="password"
                                    placeholder="Password"
                                />

                                <TextFieldGroup
                                    type="password"
                                    onChange={this.onChange}
                                    error={errors.password2}
                                    value={this.state.password2}
                                    name="password2"
                                    placeholder="Confirm Password"
                                />

                                <input id="submit" type="submit" className="btn btn-info btn-block mt-4"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Register.propTypes = {
    registerUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors
});

export default connect(mapStateToProps, {
    registerUser
})(withRouter(Register));