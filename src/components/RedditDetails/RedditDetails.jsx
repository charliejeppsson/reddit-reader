import React from 'react';
import PropTypes from 'prop-types';
import './RedditDetails.scss';

function RedditDetails(props) {
  const { post } = props.location;

  return (
    <div className="RedditDetails">
      <h2>{post.title}</h2> 
      <p>{post.selftext}</p>
    </div>
  );
}

RedditDetails.propTypes = {
  post: PropTypes.shape({
    selftext: PropTypes.string,
    title: PropTypes.string,
  }),
};

export default RedditDetails;
