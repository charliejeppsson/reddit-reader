import axios from 'axios';

async function getPosts({
  type,
  currentPage,
  setCurrentPage,
  count,
  setCount,
  nextPage,
  setNextPage,
  prevPage,
  setPrevPage,
  setLoading,
  setPosts,
}) {
  console.log('count before request: ', count);

  let params = { count, limit: 10 };
  if (type === 'next') {
    params.after = nextPage;
  } else if (type === 'prev') {
    params.before = prevPage;
  }
  console.log('params: ', params);

  try {
    setLoading(true);
    const response = await axios.get(
      'https://www.reddit.com/r/javascript.json',
      { params: { ...params } }
    );
    console.log('res: ', response);

    // Update posts:
    // On the first page Reddit will ignore the limit and also pass along posts
    // marked with stickied: true. Hence, we only want to display and count the
    // ones with stickied: false to only show 10 posts per page.
    const filteredPosts = response.data.data.children.filter(post => (
      !post.data.stickied
    ));
    const newPosts = filteredPosts.map(post => (
      {
        id: post.data.id,
        author: post.data.author,
        created: post.data.created_utc,
        commentCount: post.data.num_comments,
        permalink: post.data.permalink,
        score: post.data.score,
        selftext: post.data.selftext,
        thumbnail: post.data.thumbnail,
        title: post.data.title,
      }
    ));
    setPosts(newPosts);

    // Update count and currentPage for next request
    if (type === 'first') {
      setCount(count + newPosts.length);
      setCurrentPage(currentPage + 1);   
    } else if (type === 'next') {
      setCount(count + newPosts.length);
      setCurrentPage(currentPage + 1);   
    } else if (type === 'prev') {
      setCount(count - newPosts.length);
      setCurrentPage(currentPage - 1);   
    }

    // Update prevPage and nextPage for next request
    const { before, after } = response.data.data;
    setPrevPage(before);
    setNextPage(after);
    setLoading(false);
  } catch (err) {
    console.log(err);
    setLoading(false);
  }
}

export default getPosts;

