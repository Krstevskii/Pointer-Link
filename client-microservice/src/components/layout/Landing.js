import React, {Component} from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";

class Landing extends Component {

    componentDidMount() {
        if(this.props.auth.isAuthenticated){
            this.props.history.push('/dashboard')
        }
    }

    render() {
        return (
        <div className="landing">
                <div className="dark-overlay landing-inner text-light">
                    <div className="container">
                        <div className="row">
                            <img alt="logo" className="pointer-logo" src="/static/img/CompanyLogo.png" style={{
                                height: "100px",
                                width: "auto",
                                margin: "159px auto"
                            }}/>
                        </div>
                        <div className="row">

                            <div className="col-md-12 text-center">
                                <h1 className="display-3 mb-4 pointer-link">Pointer Link
                                </h1>
                                <p className="lead"> Create a developer profile/portfolio, share posts and get help from
                                    other developers</p>
                                <div className="dropdown-divider"/>
                                <Link id="submit" to="/register" className="btn btn-lg btn-info mr-2">Sign Up</Link>
                                <Link to="/login" className="btn btn-lg btn-light">Login</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

Landing.propType = {
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps)(withRouter(Landing));