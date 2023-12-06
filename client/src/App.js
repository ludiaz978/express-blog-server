import { useState, useEffect } from 'react'
import axios from 'axios'

const BASE_URL = 'http://localhost:3001'

const App = () => {
  // create state variable to sore all available posts
  const [posts, setPosts]= useState([]);
  // create state variable to store data for a new post
  const [newPost, setNewPost]= useState({id: 0, title: '', content: '', comments: []});
  const [editingPost, setEditingPost] = useState(null);

  // use useEffect to use axios to fetch all blog posts on page load
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/posts`);
        setPosts(response.data);
      } catch (error) {
        console.error('Error fetching posts: ', error);
      }
    };
    fetchPosts();
  }, [])

  // create delete function
  const handleDelete = async (postId) => {
		try {
			await axios.delete(`${BASE_URL}/posts/${postId}`);
			// filter out the post to delete from the posts state array
			setPosts(posts.filter((post) => post.id !== postId));
		} catch (error) {
			console.error('Error deleting post:', error);
		}
	};

  const handleEditPost = async (e) => {
		try {
			// send a put request with updated post data
			await axios.put(
				`${BASE_URL}/posts/${editingPost.id}`,
				editingPost
			);
			// update client side content
			setPosts(
				posts.map((post) =>
					post.id === editingPost.id ? editingPost : post
				)
			);
			// reset the editing post state to null
			setEditingPost(null);
		} catch (error) {
			console.error('Error editing post', error);
		}
	};

  // create submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setNewPost({...newPost, id: Date.now()})
    try {
      // send a post request with new post in the request body
      await axios.post(`${BASE_URL}/posts`, newPost);
      // update client side content
      setPosts([...posts, newPost]);
      // reset the new post state to blank
      setNewPost({id: 0, title: '', content: '', comments: []});
    } catch (error) {
      console.error("Error adding post", error);
    }
  }

  return (
		<div>
			<h1>Blog Posts</h1>
			<ul>
				{posts.map((post) =>
					(editingPost && editingPost.id === post.id) ? (
						
            <li key={post.id}>
              {/*Need this to be a form*/}
							<input 
                type='text' 
                placeholder={post.title}
                value={editingPost.title} 
              />
							<textarea 
                placeholder={post.content} 
                value={editingPost.content}                
              />
							<button onClick={() => handleDelete(post.id)}>
								Delete
							</button>
							<button onClick={() => handleEditPost()}>Edit</button>
						</li>
					) : (
						<li key={post.id}>
							<h2>{post.title}</h2>
							<p>{post.content}</p>
							<button onClick={() => handleDelete(post.id)}>
								Delete
							</button>
							<button onClick={() => setEditingPost(post)}>
								Edit
							</button>
						</li>
					)
				)}
			</ul>
			<br />
			<form onSubmit={handleSubmit} style={{ display: 'block' }}>
				<h3>Create new post</h3>
				<input
					style={{ display: 'block', marginBottom: '10px' }}
					type='text'
					placeholder='Title...'
					value={newPost.title}
					// when the value in the input field changes, update the title property of the newPost state
					onChange={(e) =>
						setNewPost({ ...newPost, title: e.target.value })
					}
				/>
				<textarea
					style={{ display: 'block', marginBottom: '10px' }}
					placeholder='Content...'
					value={newPost.content}
					onChange={(e) =>
						setNewPost({ ...newPost, content: e.target.value })
					}
				/>
				<button
					type='submit'
					style={{ display: 'block', marginBottom: '10px' }}
				>
					Submit
				</button>
			</form>
		</div>
	);
}

export default App