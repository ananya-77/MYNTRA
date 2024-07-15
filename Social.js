// SocialFeed.jsx
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

const SocialFeed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    socket.on('newPost', (post) => {
      setPosts((prevPosts) => [post, ...prevPosts]);
    });
  }, []);

  return (
    <div>
      {posts.map((post, index) => (
        <div key={index}>
          <img src={post.url} alt={post.name} />
          <p>{post.labels.join(', ')}</p>
        </div>
      ))}
    </div>
  );
};

export default SocialFeed;
