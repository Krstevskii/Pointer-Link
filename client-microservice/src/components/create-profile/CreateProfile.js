import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextFieldGroup from '../common/TextFieldGroup';
import InputGroup from '../common/InputGroup';
import SelectListGroup from '../common/SelectListGroup';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import { createProfile } from '../../actions/profileActions';
import { withRouter } from "react-router-dom";

class CreateProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            displaySocialInputs: false,
            handle: '',
            company: '',
            website: '',
            location: '',
            status: '',
            skills: '',
            githubusername: '',
            bio: '',
            twitter: '',
            facebook: '',
            linkedin: '',
            youtube: '',
            instagram: '',
            errors: {}
        }
    }

    onSubmit = (e) => {
        e.preventDefault();

        const profileData = {
            handle: this.state.handle,
            company: this.state.company,
            website: this.state.website,
            location: this.state.location,
            status: this.state.status,
            skills: this.state.skills,
            githubusername: this.state.githubusername,
            bio: this.state.bio,
            twitter: this.state.twitter,
            facebook: this.state.facebook,
            linkedin: this.state.linkedin,
            youtube: this.state.youtube,
            instagram: this.state.instagram
        };

        this.props.createProfile(profileData, this.props.history)

    };

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            })
        }
    }

    render() {

        const { errors, displaySocialInputs } = this.state;

        let socialInputs;

        if(displaySocialInputs) {
            socialInputs = (
                <div>
                    <InputGroup
                        onChange={(e) => this.onChange(e)}
                        placeholder="Twitter Profile URL"
                        name="twitter"
                        value={this.state.twitter}
                        icon="fa fa-twitter"
                    />
                    <InputGroup
                        placeholder="Facebook Page URL"
                        name="facebook"
                        icon="fa fa-facebook"
                        value={this.state.facebook}
                        onChange={(e) => this.onChange(e)}
                        error={errors.facebook}
                    />

                    <InputGroup
                        placeholder="Linkedin Profile URL"
                        name="linkedin"
                        icon="fa fa-linkedin"
                        value={this.state.linkedin}
                        onChange={(e) => this.onChange(e)}
                        error={errors.linkedin}
                    />

                    <InputGroup
                        placeholder="YouTube Channel URL"
                        name="youtube"
                        icon="fa fa-youtube"
                        value={this.state.youtube}
                        onChange={(e) => this.onChange(e)}
                        error={errors.youtube}
                    />

                    <InputGroup
                        placeholder="Instagram Page URL"
                        name="instagram"
                        icon="fa fa-instagram"
                        value={this.state.instagram}
                        onChange={(e) => this.onChange(e)}
                        error={errors.instagram}
                    />
                </div>
            )
        }

        // Select options for status
        const options = [{
            label: '* Select Professional Status',
            value: 0
        }, {
            label: 'Developer',
            value: 'Developer'
        }, {
            label: 'Junior Developer',
            value: 'Junior Developer'
        }, {
            label: 'Senior Developer',
            value: 'Senio Developer'
        }, {
            label: 'Manager',
            value: 'Manager'
        }, {
            label: 'Student of Learning',
            value: 'Student of Learning'
        }, {
            label: 'Instructor or Teacher',
            value: 'Instructor or Teacher'
        }, {
            label: 'Intern',
            value: 'Intern'
        }, {
            label: 'Other',
            value: 'Other'
        }];

        return (
            <div className="create-profile">
                <div className="container">
                    <div className="row">
                        <div className="col-md-8 m-auto">
                            <h1 className="display-4 text-center">Create Your Profile</h1>
                            <p className="lead text-center">
                                Let's get some information to make your profile stand out
                            </p>
                            <small className="d-block pb-3">* = required fields</small>
                            <form onSubmit={(e) => this.onSubmit(e)}>
                                <TextFieldGroup
                                    onChange={(e) => this.onChange(e)}
                                    placeholder="* Profile Handle"
                                    error = { errors.handle }
                                    value={this.state.handle}
                                    info="A unique handle for your profile URL. Your full name, company name, nickname"
                                    name="handle"
                                />
                                <SelectListGroup
                                    onChange={(e) => this.onChange(e)}
                                    placeholder="Status"
                                    error = { errors.status }
                                    value={this.state.status}
                                    options={options}
                                    info="Give us an idea of where you are at in your career"
                                    name="status"
                                />
                                <TextFieldGroup
                                    onChange={(e) => this.onChange(e)}
                                    placeholder="Company"
                                    error = { errors.company }
                                    value={this.state.company}
                                    info="Could be your own company or one you work for"
                                    name="company"
                                />
                                <TextFieldGroup
                                    placeholder="Website"
                                    name="website"
                                    value={this.state.website}
                                    onChange={(e) => this.onChange(e)}
                                    error={errors.website}
                                    info="Could be your own website or a company one"
                                />
                                <TextFieldGroup
                                    placeholder="Location"
                                    name="location"
                                    value={this.state.location}
                                    onChange={(e) => this.onChange(e)}
                                    error={errors.location}
                                    info="City or city & state suggested (eg. Boston, MA)"
                                />
                                <TextFieldGroup
                                    placeholder="* Skills"
                                    name="skills"
                                    value={this.state.skills}
                                    onChange={(e) => this.onChange(e)}
                                    error={errors.skills}
                                    info="Please use comma separated values (eg.  HTML,CSS,JavaScript,PHP)"
                                />
                                <TextFieldGroup
                                    placeholder="Github Username"
                                    name="githubusername"
                                    value={this.state.githubusername}
                                    onChange={(e) => this.onChange(e)}
                                    error={errors.githubusername}
                                    info="If you want your latest repos and a Github link, include your username"
                                />
                                <TextAreaFieldGroup
                                    placeholder="Short Bio"
                                    name="bio"
                                    value={this.state.bio}
                                    onChange={(e) => this.onChange(e)}
                                    error={errors.bio}
                                    info="Tell us a little about yourself"
                                />

                                <div className="mb-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            this.setState(prevState => ({
                                                displaySocialInputs: !prevState.displaySocialInputs
                                            }))
                                        }}
                                        className="btn btn-light">
                                        Add Social Network Links
                                    </button>
                                    <span className="text-muted"> Optional</span>
                                </div>
                                {socialInputs}
                                <input type="submit" value="Submit" className="btn btn-info btn-block mt-4"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

CreateProfile.propTypes = {
    profile: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    profile: state.profile,
    errors: state.errors
});

export default connect(mapStateToProps, {
    createProfile
})(withRouter(CreateProfile));