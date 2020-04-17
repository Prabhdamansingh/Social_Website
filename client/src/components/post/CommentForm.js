import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addComment } from '../../action/post';

const CommentForm = ({ addComment, PostId }) => {
    const [text, setText] = useState('');

    return (
        <div className="post-form">
            <div className="bg-primary p">
                <h3>Leave a comment</h3>
            </div>
            <form
                className="form my-1"
                onSubmit={(e) => {
                    e.preventDefault();
                    addComment(PostId, { text });
                    setText('');
                }}
            >
                <textarea
                    name="text"
                    cols="30"
                    rows="5"
                    placeholder="Add comment"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    required
                ></textarea>
                <input
                    type="submit"
                    className="btn btn-dark my-1"
                    value="Submit"
                />
            </form>
        </div>
    );
};

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired,
};

export default connect(null, { addComment })(CommentForm);
