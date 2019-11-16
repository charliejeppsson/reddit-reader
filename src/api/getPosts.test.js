import mockAxios from 'axios';
import getPosts, { setHttpParams } from './getPosts';

jest.mock('axios');

// An integration test
describe('getPosts()', () => {
  const defaultPostAttrs = { // Raw mock post objects to receive from Reddit
    author: 'User1',
    created_utc: 1573328887,
    num_comments: 12,
    permalink: '/r/javascript/comments/dtuz0j/showoff_saturday_november_09_2019/',
    score: 34,
    selftext: 'Lorem ipsum dolor lorem ipsum dolor',
    stickied: false,
    thumbnail: '',
    title: 'Post #1',
  };

  let expectedPosts = [
    { id: 1, ...defaultPostAttrs },
    { id: 2, ...defaultPostAttrs },
    { id: 3, ...defaultPostAttrs },
    { id: 4, ...defaultPostAttrs },
    { id: 5, ...defaultPostAttrs },
    { id: 6, ...defaultPostAttrs },
    { id: 7, ...defaultPostAttrs },
    { id: 8, ...defaultPostAttrs },
    { id: 9, ...defaultPostAttrs },
    { id: 10, ...defaultPostAttrs },
  ];

  expectedPosts.forEach(post => {
    post.commentCount = post.num_comments;
    post.created = post.created_utc;
    delete post.num_comments;
    delete post.created_utc;
    delete post.stickied;
  });

  let posts = [];
  let getPostsArgs = {
    currentPage: 0,
    setCurrentPage: (page) => { getPostsArgs.currentPage = page; },
    count: 0,
    setCount: (count) => { getPostsArgs.count = count; },
    nextPage: null,
    setNextPage: (nextPage) => { getPostsArgs.nextPage = nextPage; },
    prevPage: null,
    setPrevPage: (prevPage) => { getPostsArgs.prevPage = prevPage; },
    setLoading: () => {},
    setPosts: (newPosts) => { posts = newPosts; },
    type: 'first',
  };

  test('updates posts correctly after successful API request', async () => {
    mockAxios.get.mockImplementationOnce(() => Promise.resolve({
      data: {
        data: {
          children: [
            { data: { id: 1, ...defaultPostAttrs } },
            { data: { id: 2, ...defaultPostAttrs } },
            { data: { id: 3, ...defaultPostAttrs } },
            { data: { id: 4, ...defaultPostAttrs } },
            { data: { id: 5, ...defaultPostAttrs } },
            { data: { id: 6, ...defaultPostAttrs } },
            { data: { id: 7, ...defaultPostAttrs } },
            { data: { id: 8, ...defaultPostAttrs } },
            { data: { id: 9, ...defaultPostAttrs } },
            { data: { id: 10, ...defaultPostAttrs } },
          ]
        }
      }
    }));
    await getPosts(getPostsArgs);
    expect(mockAxios.get).toHaveBeenCalledTimes(1);
    expect(mockAxios.get).toHaveBeenCalledWith(
      'https://www.reddit.com/r/javascript.json',
      { params: { count: 0, limit: 10 } }
    );
    expect(posts).toEqual(expectedPosts);
  });
});

// Some unit tests
describe('setHttpParams()', () => {
  test('only sets count and limit on first call', () => {
    const args = { count: 0, prevPage: null, nextPage: null, type: 'first' };
    const expectedParams = { count: 0, limit: 10 };
    expect(setHttpParams(args)).toEqual(expectedParams);
  });

  test("doesn't set 'after' param on 'prev' call", () => {
    const args = { count: 30, prevPage: 't3dv', nextPage: null, type: 'prev' };
    const expectedParams = { count: 30, limit: 10, before: 't3dv' };
    expect(setHttpParams(args)).toEqual(expectedParams);
  });

  test("doesn't set 'before' param on 'next' call", () => {
    const args = { count: 10, prevPage: null, nextPage: 'f5hg', type: 'next' };
    const expectedParams = { count: 10, limit: 10, after: 'f5hg' };
    expect(setHttpParams(args)).toEqual(expectedParams);
  });
});
