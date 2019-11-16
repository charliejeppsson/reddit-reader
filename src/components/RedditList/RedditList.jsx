import React, { useState, useEffect } from 'react';
import RedditListItem from '../RedditListItem/RedditListItem';
import getPosts from '../../api/getPosts';
import './RedditList.scss';

function RedditList() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [prevPage, setPrevPage] = useState(null);
  const [nextPage, setNextPage] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);

  useEffect(() => {
    // Can't use requestParams since useEffect will then behave as
    // componentDidUpdate (we want componentDidMount)
    getPosts({
      count: 0,
      setCount,
      currentPage: 0,
      setCurrentPage,
      nextPage: null,
      setNextPage,
      prevPage: null,
      setPrevPage,
      setLoading,
      setPosts,
      type: 'first',
    });
  }, []);


  const requestParams = {
    count,
    setCount,
    currentPage,
    setCurrentPage,
    nextPage,
    setNextPage,
    prevPage,
    setPrevPage,
    setLoading,
    setPosts,
  };

  const renderListItems = () => {
    return posts.map(post => (
      <RedditListItem key={post.id} post={post} />
    ));
  };

  const handlePrevPage = (e) => {
    e.preventDefault();
    getPosts({ ...requestParams, type: 'prev', nextPage: null });
  };

  const handleNextPage = (e) => {
    e.preventDefault();
    getPosts({ ...requestParams, type: 'next', prevPage: null });
  };

  return (
    <div>
      <h2>Reddit Javascript Posts</h2>

      {
        loading ?
          <p>Fetching posts...</p> :

          <React.Fragment>
            <ul className="RedditList">
              {
                posts.length ?
                  renderListItems() :
                  <p>No posts were found :(</p>
              }
            </ul>


            <div className="RedditList__pagination">
              <div>
                {
                  currentPage > 1 && prevPage &&
                    <button
                      className="RedditList__pagination-btn"
                      onClick={(e) => handlePrevPage(e)}
                    >
                      {"<"}
                    </button>
                }
              </div>

              <p>Page {currentPage}</p>

              <div>
                {
                  nextPage &&
                    <button
                      className="RedditList__pagination-btn"
                      onClick={(e) => handleNextPage(e)}
                    >
                      {">"}
                    </button>
                }
              </div>
            </div>
          </React.Fragment>
      }
    </div>
  );
}

export default RedditList;
