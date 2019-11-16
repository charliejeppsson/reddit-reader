import axios from 'axios';

export default async function getPosts({
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
  type,
}) {
  try {
    setLoading(true);
    const httpParams = setHttpParams({ count, prevPage, nextPage, type });
    const response = await sendHttpRequest(httpParams);
    const filteredPosts = filterPosts(response);
    const newPosts = formatNewPosts(filteredPosts);
    setPosts(newPosts);
    updateCount({ count, setCount, newCount: newPosts.length, type });
    updateCurrentPage({ currentPage, setCurrentPage, type });
    updatePrevAndNext({ response, setPrevPage, setNextPage });
    setLoading(false);
  } catch (err) {
    console.log(err);
    setLoading(false);
  }
}

function sendHttpRequest(httpParams) {
  return axios.get(
    'https://www.reddit.com/r/javascript.json',
    { params: httpParams }
  );
}

export function setHttpParams({ count, prevPage, nextPage, type }) {
  let params = { count, limit: 10 };
  if (type === 'next') {
    params.after = nextPage;
  } else if (type === 'prev') {
    params.before = prevPage;
  }
  return params;
}

function filterPosts(response) {
  // On the first page Reddit will ignore the limit and also pass along posts
  // marked with stickied: true. Hence, we only want to display and count the
  // ones with stickied: false to only show 10 posts per page.
  return response.data.data.children.filter(post => (
    !post.data.stickied
  ));
}

function formatNewPosts(filteredPosts) {
  return filteredPosts.map(post => (
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
}

function updateCount(args) {
  const { count, setCount, newCount, type } = args;
  if (type === 'first' || type === 'next') {
    setCount(count + newCount);
  } else if (type === 'prev') {
    setCount(count - newCount);
  }
}

function updateCurrentPage(args) {
  const { currentPage, setCurrentPage, type } = args;
  if (type === 'first' || type === 'next') {
    setCurrentPage(currentPage + 1);   
  } else if (type === 'prev') {
    setCurrentPage(currentPage - 1);   
  }
}

function updatePrevAndNext(args) {
  // Update prevPage and nextPage for next request
  const { response, setPrevPage, setNextPage } = args;
  const { before, after } = response.data.data;
  setPrevPage(before);
  setNextPage(after);
}
