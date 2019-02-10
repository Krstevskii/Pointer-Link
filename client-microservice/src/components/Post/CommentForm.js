import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import TextAreaFieldGroup from '../common/TextAreaFieldGroup';
import {addComment} from "../../actions/postActions";

class CommentForm extends Component {

    constructor(props) {
        super(props);
        this.state = {
            text: '',
            errors: {}
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.errors) {
            this.setState({
                errors: nextProps.errors
            });
        }
    }

    onChange = (e) => {
        this.setState(
            {[e.target.name]: e.target.value}
        )
    };

    onSubmit = (e) => {
        e.preventDefault();

        const {user} = this.props.auth;
        const {postId} = this.props;

        const newComment = {
            text: this.state.text,
            name: user.name,
            avatar: user.avatar
        };

        this.props.addComment(postId, newComment);
        this.setState({text: '', errors: {}});

    };

    render() {

        const {errors} = this.state;

        return (
            <div className="post-form mb-3">
                <div className="card card-info">
                    <div id="submit" className="card-header text-white">
                        Make a comment...
                    </div>
                    <div className="card-body">
                        <form onSubmit={(e) => this.onSubmit(e)}>
                            <div className="form-group">
                                <TextAreaFieldGroup
                                    placeholder="Reply to post"
                                    error={errors.text}
                                    onChange={(e) => this.onChange(e)}
                                    value={this.state.text}
                                    name="text"/>
                            </div>
                            <button type="submit" className="btn btn-dark">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired
};

const mapStateToProps = (state) => ({
    errors: state.errors,
    auth: state.auth
});

export default connect(mapStateToProps, {
    addComment
})(CommentForm);