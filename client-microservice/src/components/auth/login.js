import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { loginUser } from "../../actions/authActions";
import { withRouter } from "react-router-dom";
import TextFieldGroup from '../common/TextFieldGroup'; 

class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: {}
        }
    }

    onChange = (e) => {
        this.setState({ [e.target.name]: e.target.value })
    };

    onSubmit = (e) => {
        e.preventDefault();

        const userData = {
            email: this.state.email,
            password: this.state.password
        };

        this.props.loginUser(userData)


    };

    componentDidMount() {
        if(this.props.auth.isAuthenticated){
            this.props.history.push('/dashboard')
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {

        if(nextProps.auth.isAuthenticated)
            this.props.history.push('/dashboard');

        if(nextProps.errors)
            this.setState({ errors: nextProps.errors });
    }

    render() {
        const { errors } = this.state;

        return (
            <div className="login">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Log In</h1>
                            <p className="lead text-center">Sign in to your account</p>
                            <form onSubmit={(event) => this.onSubmit(event)}>
                                
                                <TextFieldGroup type="email" onChange={this.onChange} error={errors.email} value={this.state.email} name="email" placeholder="Email Address"/>
                                <TextFieldGroup type="password" onChange={this.onChange} error={errors.password} value={this.state.password} name="password" placeholder="Password"/>

                                <input id="submit" type="submit" className="btn btn-info btn-block mt-4"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

Login.propTypes = {
    loginUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth,
    errors: state.errors

});

export default connect(mapStateToProps, {
    loginUser
})(withRouter(Login));