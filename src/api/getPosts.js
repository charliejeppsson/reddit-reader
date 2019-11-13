import axios from 'axios';
import PropTypes from 'prop-types';

async function getPosts({ page, setPosts }) {
  try {
    const response = await axios.get(
      'https://www.reddit.com/r/javascript.json',
      {
        params: { limit: 10 }
      }
    );
    console.log(response);
    const newPosts = response.data.data.children.map(post => (
      {
        id: post.data.id,
        author: post.data.author,
        created: post.data.created,
        commentCount: post.data.num_comments,
        permalink: post.data.permalink,
        score: post.data.score,
        selftext: post.data.selftext,
        thumbnail: post.data.thumbnail,
        title: post.data.title,
      }
    ));
    setPosts(newPosts);
  } catch (err) {
    console.log(err);
  }
}

getPosts.propTypes = {
  page: PropTypes.number.isRequired,
  setPosts: PropTypes.func.isRequired,
}

export default getPosts;

