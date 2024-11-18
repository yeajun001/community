import axios from 'axios';
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import Header from "./Header";
import './style.css';


function Home() {
  const location = useLocation();
  const navigate = useNavigate();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("갤러리");
  const [editingPost, setEditingPost] = useState(null); // Track post being edited

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category") || "갤러리";
    setActiveCategory(category);
    fetchPostsByCategory(category);

    
  }, [location]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios
        .get('http://localhost:3001/api/user', {
          headers: { Authorization: token },
        })
        .then((response) => {
          setIsLoggedIn(true);
          setUsername(response.data.username);
        })
        .catch((error) => {
          console.error("로그인 상태 확인 실패:", error);
          localStorage.removeItem('token'); // 토큰이 유효하지 않으면 삭제
        });
    }
  }, []);
  // Fetch posts by category
  const fetchPostsByCategory = async (category) => {
    try {
      const response = await axios.get(`http://localhost:3001/api/posts/${encodeURIComponent(category)}`);
      setPosts(response.data);
    } catch (error) {
      console.error(`Error fetching ${category} posts:`, error);
    }
  };

  // Handle login
  const handleLogin = async () => {
    const id = document.getElementById('id').value;
    const password = document.getElementById('password').value;

    try {
      const response = await axios.post('http://localhost:3001/login', { id, password });
      localStorage.setItem('token', response.data.token);
      setIsLoggedIn(true);
      setUsername(id);
      alert(response.data.message);
    } catch (error) {
      alert('로그인 실패! 아이디와 비밀번호를 확인하세요.');
      console.error('Login error:', error.response ? error.response.data : error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    setIsLoggedIn(false);
  };

  // Handle delete post (only for admin)
  const handleDelete = async (postId) => {
    if (username !== 'admin') {
      alert("Only admin can delete posts.");
      return;
    }

    try {
      await axios.delete(`http://localhost:3001/api/posts/${encodeURIComponent(activeCategory)}/${postId}`, {
        headers: {
          Authorization: localStorage.getItem('token')
        },
      });
      console.log(postId);
      alert("Post deleted successfully.");
      fetchPostsByCategory(activeCategory);
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  // Handle edit post

  // Handle update post
  const handleUpdate = async () => {
    if (!editingPost) return;

    try {
      await axios.put(`http://localhost:3001/api/posts/${encodeURIComponent(activeCategory)}/${editingPost.id}`, {
        title: editingPost.title,
        content: editingPost.content,
      }, {
        headers: {
          Authorization: localStorage.getItem('token')
        }
      });
      alert("Post updated successfully.");
      setEditingPost(null); // Clear editing state
      fetchPostsByCategory(activeCategory);
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  };

  // Update title/content of the post being edited
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingPost((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div>
      <Header />

      <div className="container">
        <div className="main-content">
          <h2>{activeCategory} 게시글 목록</h2>
          <table className="post-table">
          <thead>
  <tr>
    <th>제목</th>
    <th>내용</th>
    <th>작성일</th>
    {username === 'admin' && <th>관리</th>}
  </tr>
</thead>
<tbody>
  {posts.length > 0 ? (
    posts.map((post) => (
      <tr key={post.id}>
        <td onClick={() => navigate(`/post/${post.id}`, { state: { post } })}>{post.title}</td>
        <td>{post.content}</td>
        <td>{new Date(post.created_at).toLocaleDateString()}</td>
        {username === 'admin' && (
          <td>
            <button onClick={() => handleDelete(post.id)}>삭제</button>
          </td>
        )}
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan={username === 'admin' ? 4 : 3}>데이터가 없습니다</td>
    </tr>
  )}
</tbody>

          </table>

          {editingPost && (
            <div className="edit-form">
              <h3>게시글 수정</h3>
              <input
                type="text"
                name="title"
                value={editingPost.title}
                onChange={handleInputChange}
                placeholder="제목"
              />
              <textarea
                name="content"
                value={editingPost.content}
                onChange={handleInputChange}
                placeholder="내용"
              ></textarea>
              <button onClick={handleUpdate}>업데이트</button>
              <button onClick={() => setEditingPost(null)}>취소</button>
            </div>
          )}
        </div>

        <div className="sidebar">
          <div className="login-form">
            {isLoggedIn ? (
              <div className="logged-in-info">
                <div className="username">
                  <span>{username}님 &gt;</span>
                  <button className="logout-button" onClick={handleLogout}>로그아웃</button>
                </div>
                <div className="user-stats">
                  <span>글 0</span> <span>댓글 0</span> <span>방명록 0</span>
                </div>
                <div className="user-buttons">
                  <button onClick={() => navigate('/my-page')}>MY갤로그</button>
                  <button>고정닉정보</button>
                  <button>상품권</button>
                  <button>즐겨찾기</button>
                  <button>운영/가입</button>
                  <button>알림</button>
                </div>
              </div>
            ) : (
              <>
                <input type="text" placeholder="아이디" id="id" />
                <input type="password" placeholder="패스워드" id="password" />
                <button className="signup-button" onClick={() => navigate('/signup')}>회원가입</button> {/* Sign Up button */}
                <button className="login-button" onClick={handleLogin}>로그인</button>
              </>
            )}
          </div>

          <div className="trend-ranking">
            <h3>트렌드 랭킹</h3>
            <div className="tabs">
              <button className="active"></button>
              <button></button>
              <button></button>
            </div>
            <ul className="ranking-list">
              {Array.from({ length: 10 }).map((_, index) => (
                <li key={index}>
                  <span className="rank-number">{index + 1}</span>
                  <span className="name">사용자 {index + 1}</span>
                  <span className="score">점수</span>
                  <span className={index === 0 ? 'trend-up' : index === 1 ? 'trend-down' : ''}>
                    {index > 1 ? '–' : ''}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
