import React, { Fragment, useEffect } from 'react';
import PropTypes from 'prop-types';
import Spinner from '../layout/Spinner';
import { connect } from 'react-redux';
import { getProfileById } from '../../action/profile';
import { Link } from 'react-router-dom';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';

const Profile = ({
    match,
    getProfileById,
    profile: { profile, loading },
    auth,
}) => {
    useEffect(() => {
        getProfileById(match.params.id);
    }, [getProfileById]);

    return (
        <Fragment>
            {profile === null || loading ? (
                <Spinner />
            ) : (
                <Fragment>
                    <Link to="/profiles" className="btn btn-primary">
                        Go Back
                    </Link>
                    {auth.isAuthenticated &&
                        auth.user._id === profile.user._id && (
                            <Link
                                to="/edit-profile"
                                className="btn btn-dark my-1"
                            >
                                Edit Profile
                            </Link>
                        )}
                    <div className="profile-grid my-1">
                        <ProfileTop profile={profile}></ProfileTop>
                        <ProfileAbout profile={profile}></ProfileAbout>

                        <div className="profile-exp bg-white p-2">
                            <h2 className="text-primary">Experience</h2>
                            {profile.experience.length > 0 ? (
                                <Fragment>
                                    {profile.experience.map((experience) => (
                                        <ProfileExperience
                                            key={experience._id}
                                            experience={experience}
                                        ></ProfileExperience>
                                    ))}
                                </Fragment>
                            ) : (
                                <h4>No Experience credential</h4>
                            )}
                        </div>

                        <div className="profile-edu bg-white p-2">
                            <h2 className="text-primary">Education</h2>
                            {profile.education.length > 0 ? (
                                <Fragment>
                                    {profile.education.map((edu) => (
                                        <ProfileEducation
                                            key={edu._id}
                                            education={edu}
                                        ></ProfileEducation>
                                    ))}
                                </Fragment>
                            ) : (
                                <h4>No Education credential</h4>
                            )}
                        </div>

                        {profile.githubusername && (
                            <ProfileGithub
                                username={profile.githubusername}
                            ></ProfileGithub>
                        )}
                    </div>
                </Fragment>
            )}
        </Fragment>
    );
};

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
    profile: state.profile,
    auth: state.auth,
});
export default connect(mapStateToProp, { getProfileById })(Profile);
