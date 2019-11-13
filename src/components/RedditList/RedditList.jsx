import React, { useState, useEffect } from 'react';
import RedditListItem from '../RedditListItem/RedditListItem';
import getPosts from '../../api/getPosts';
import './RedditList.scss';

function RedditList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getPosts({ page: 1, setPosts });
    setLoading(false);
  }, []);

  const renderListItems = () => {
    return posts.map(post => (
      <RedditListItem key={post.id} post={post} />
    ));
  };

  return (
    <div>
      <h2>Reddit Javascript Posts</h2>

      {
        loading ?
          <p>Fetching posts...</p> :
          <ul className="RedditList">
            {
              posts.length ?
                renderListItems() :
                <p>No posts were found :(</p>
            }
          </ul>
      }
    </div>
  );
}

export default RedditList;
