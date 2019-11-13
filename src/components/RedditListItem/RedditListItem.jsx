import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment';
import './RedditListItem.scss';

function RedditListItem({ post }) {
  const formatCreatedAt = date => {
    const dateObject = new Date(date * 1000)
    return moment(dateObject).fromNow()
  }

  return (
    <Link
      to={{ pathname: "/posts/" + post.id, post }}
      className="RedditListItem"
    >
      <li className="RedditListItem__container">
        <p className="RedditListItem__createdAt">
          {formatCreatedAt(post.created)} by {post.author}
        </p>

        <h3 className="RedditListItem__title">
          {post.title}
        </h3>

        <p className="RedditListItem__permalink">
          Permalink: {post.permalink}
        </p>

        <p>Thumbnail: {post.thumbnail}</p>

        <div className="RedditListItem__footer">
          <p>Score: {post.score}</p>
          <p>Comments: {post.commentCount}</p>
        </div>
      </li>
    </Link>
  );
}

RedditListItem.propTypes = {
  post: PropTypes.shape({
    author: PropTypes.string,
    commentCount: PropTypes.number,
    permaLink: PropTypes.string,
    score: PropTypes.number,
    thumbnail: PropTypes.string,
    title: PropTypes.string,
  })
};

export default RedditListItem;
