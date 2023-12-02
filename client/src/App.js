import { useState, useEffect } from 'react';
import axios from 'axios';
const BASE_URL ="http://localhost:3001"
function App() {
  //create state variable to store all variable posts
  const [posts, setPosts] = useState([]);
 //create state variable to store data for a new post
  const [newPost, setNewPost] = useState({id:0, title: "", content: "", comments: []});
  //use ueseEffect to use axios to fetch all blog posts on page load
  useEffect(() => {
  const fetchPosts = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/posts`);
      setPosts(response.data);
    } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };
    fetchPosts();
  }, []); // only want effect to run when page loads the first time
  const handleDelete = async (postId) => {
  try {
await axios.delete(`${BASE_URL}/posts/${postId}`)
setPosts(posts.filter(post => post.id !== postId));
} catch (error) {
  console.error("Error deleting post:", error);
}
}

const handleSubmit = async (e) => {
  e.preventDefault();
  //update the id of the new post to be the current datetime
  setNewPost({...newPost, id: Date.now()})
try {
  //send a post request with newPost in the request body
  await axios.post(`${BASE_URL}/posts`, newPost)
  setPosts([...posts, newPost]);
  //reset the new post state so that it is ready for another new post
  setNewPost({id: 0, title: "", content: "", comments: []});
} catch (error) {
  console.error("Error adding post:", error);
}
}
  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map(post => (
        <li key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.content}</p>
          <button onClick={() =>handleDelete(post.id)}>Delete Post</button>
          </li>
        ))}
      </ul>
      {/* {posts ? JSON.stringify(posts, null, 2) : "Loading..."} */}
       <form onSubmit={handleSubmit}>
        <input
        type='text'
        placeholder='Title'
        value={newPost.title}
        onChange={(e) => setNewPost({...newPost, title: e.target.value})}
       />
       <textarea
       placeholder='Content'
       value={newPost.content}
       onChange={(e) => setNewPost({...newPost, content: e.target.value})}
       />
       <button type='submit'>Add Post</button>
       </form>
    </div>
  );
}

export default App;
