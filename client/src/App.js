import React, { Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Login from './components/auth/Login';
import Alert from './components/layout/Alert';
import Register from './components/auth/Register';
import Dashboard from './components/dashboard/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import CreateProfile from './components/profile-forms/CreateProfile';
import EditProfile from './components/profile-forms/EditProfile';
import AddExperience from './components/profile-forms/AddExperience';
import AddEducation from './components/profile-forms/AddEducation';
import Profiles from './components/profiles/Profiles';
import Profile from './components/profile/Profile';
import Posts from './components/posts/Posts';
import Post from './components/post/Post';

//redux
import { Provider } from 'react-redux'; // it connects redux and react
import store from './store';
import setAuthToken from './util/setAuthToken';
import { loadUser } from './action/auth';

import './App.css';

if (localStorage.token) {
    setAuthToken(localStorage.token);
}

const App = () => {
    useEffect(() => {
        store.dispatch(loadUser());
    }, []);

    return (
        <Provider store={store}>
            <Router>
                <Fragment>
                    <Navbar />
                    <Route exact path="/" component={Landing} />
                    <section className="container">
                        <Alert />
                        <Switch>
                            <Route
                                exact
                                path="/Register"
                                component={Register}
                            />
                            <Route exact path="/Login" component={Login} />
                            <Route
                                exact
                                path="/profile/:id"
                                component={Profile}
                            />
                            >
                            <Route
                                exact
                                path="/Profiles"
                                component={Profiles}
                            />
                            <PrivateRoute
                                path="/Dashboard"
                                exact
                                component={Dashboard}
                            />
                            <PrivateRoute
                                path="/CreateProfile"
                                exact
                                component={CreateProfile}
                            />
                            <PrivateRoute
                                path="/edit-profile"
                                exact
                                component={EditProfile}
                            />
                            <PrivateRoute
                                path="/add-experience"
                                exact
                                component={AddExperience}
                            />
                            <PrivateRoute
                                path="/add-education"
                                exact
                                component={AddEducation}
                            />
                            <PrivateRoute
                                path="/posts"
                                exact
                                component={Posts}
                            />
                            <PrivateRoute
                                path="/post/:id"
                                exact
                                component={Post}
                            />
                        </Switch>
                    </section>
                </Fragment>
            </Router>
        </Provider>
    );
};
export default App;
