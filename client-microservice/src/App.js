import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Provider} from 'react-redux';
import store from './store'
import jwt_decode from 'jwt-decode';
import setAuthToken from './utils/setAuthToken';
import {setCurrentUser} from "./actions/authActions";
import {logoutUser} from "./actions/authActions";
import {clearCurrentProfile} from "./actions/profileActions";
import EditProfile from './components/add-credentials/EditProfile';
import AddExperience from './components/add-credentials/AddExperience';
import AddEducation from "./components/add-credentials/AddEducation";
import Profiles from './components/profiles/Profiles'
import Profile from './components/profile/Profile';
import NotFound from "./components/not-found/NotFound";
import Posts from './components/posts/Post';
import Post from './components/Post/Post';

import PrivateRoute from './components/common/PrivateRoute';

import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import Landing from './components/layout/Landing'
import Register from "./components/auth/register";
import Login from "./components/auth/login";
import Dashboard from './components/dashboard/Dashboard'
import CreateProfile from './components/create-profile/CreateProfile';

import './App.css';

// Check for Token
if (localStorage.jwtToken) {



    // Set auth token header auth
    setAuthToken(localStorage.jwtToken);

    // Decode token and get user info and exp
    const decoded = jwt_decode(localStorage.jwtToken);

    // Set user and isAuthenticated
    store.dispatch(setCurrentUser(decoded));

    // Check for expired token
    const currentTime = Date.now() / 1000;
    if (decoded.exp < currentTime) {
        store.dispatch(logoutUser());
        // TODO: Clear current Profile
        store.dispatch(clearCurrentProfile());

        // Redirect to Login
        window.location.href = '/login'

    }
}

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            mainMarginBottom: 0
        }
    }

    componentDidMount() {
        let mainHeight = document.getElementById("footer").clientHeight;
        this.setState({
            mainMarginBottom: mainHeight * 1.5
        })
    }

    render() {
        return (
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <Navbar/>
                        <main id="main" style={{
                            paddingBottom: `${this.state.mainMarginBottom}px`
                        }}>
                            <Route exact path="/" component={Landing}/>
                            <div className="container">
                                <Route exact path="/register" component={Register}/>
                                <Route exact path="/login" component={Login}/>
                                <Route exact path="/profiles" component={Profiles}/>
                                <Route exact path="/profile/:handle" component={Profile}/>
                                <Switch>
                                    <PrivateRoute exact path="/dashboard" component={Dashboard}/>
                                </Switch>
                                <Switch>
                                    <PrivateRoute exact path="/create-profile" component={CreateProfile}/>
                                </Switch>
                                <Switch>
                                    <PrivateRoute exact path="/edit-profile" component={EditProfile}/>
                                </Switch>
                                <Switch>
                                    <PrivateRoute exact path="/add-experience" component={AddExperience}/>
                                </Switch>
                                <Switch>
                                    <PrivateRoute exact path="/add-education" component={AddEducation}/>
                                </Switch>
                                <Switch>
                                    <PrivateRoute exact path="/feed" component={Posts}/>
                                </Switch>
                                <Switch>
                                    <PrivateRoute exact path="/post/:id" component={Post}/>
                                </Switch>
                                <Route exact path="/not-found" component={NotFound}/>
                            </div>
                        </main>
                        <Footer/>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
