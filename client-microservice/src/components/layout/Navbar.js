import React, {Component} from 'react';
import { Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logoutUser } from "../../actions/authActions";
import { clearCurrentProfile } from "../../actions/profileActions";

class Navbar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            height: 0
        }
    }

    onLogoutClick = (e) => {
        e.preventDefault();
        this.props.clearCurrentProfile();
        this.props.logoutUser();
    };

    componentDidMount() {
        let navHeight = document.getElementById("nav").clientHeight;
        navHeight = navHeight * 0.46;
        this.setState({
            height: navHeight
        });
    }

    render() {
        const { isAuthenticated, user } = this.props.auth;

        const authLinks = (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/feed">Post Feed</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                    <a href=" " className="nav-link" onClick={(e) => this.onLogoutClick(e)}>
                        <img
                            className="rounded-circle"
                            src={ user.avatar }
                            alt={ user.name }
                            style={{
                                width: '25px',
                                marginRight: '5px'
                            }}
                            title="You must have a Gravatar connected to your Email to display an image"/>
                        Logout
                    </a>
                </li>
            </ul>
        );

        const guestLinks = (
            <ul className="navbar-nav ml-auto">
                <li className="nav-item">
                    <Link className="nav-link" to="/register">Sign Up</Link>
                </li>
                <li className="nav-item">
                    <Link className="nav-link" to="/login">Log in</Link>
                </li>
            </ul>
        );

        return (
            <nav id="nav" className="navbar navbar-expand-sm navbar-dark bg-dark mb-4">
               <div className="container">
            <Link className="navbar-brand" to="/">
                <img src="/static/img/CompanyLogo.png" alt="Logo" style={{
                    height: `${this.state.height}px`,
                    verticalAlign: "middle",
                    width: "auto"
                }}/>
            </Link>
                   <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#mobile-nav">
                       <span className="navbar-toggler-icon"/>
                   </button>

                    <div className="collapse navbar-collapse" id="mobile-nav">
                       <ul className="navbar-nav mr-auto">
                           <li className="nav-item">
                               <Link className="nav-link" to="/profiles"> {' '}
                               Developers
                               </Link>
                           </li>
                        </ul>
                        { isAuthenticated ? authLinks : guestLinks}
                   </div>
               </div>
            </nav>



        );
    }
}

Navbar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    auth: state.auth
});

export default connect(mapStateToProps, {
    logoutUser,
    clearCurrentProfile
})(Navbar);