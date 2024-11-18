import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import './PostDetail.css';

function PostDetail() {
  const { id } = useParams(); // URL에서 게시글 ID 가져오기
  const location = useLocation();
  const navigate = useNavigate();

  const [post, setPost] = useState(location.state?.post || null);
  const [comments, setComments] = useState([]); // 댓글 목록 상태
  const [newComment, setNewComment] = useState(''); // 새 댓글 입력 상태
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!post) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/api/posts/detail/${id}`);
          setPost(response.data);
        } catch (error) {
          console.error('게시글 데이터를 가져오는 중 오류 발생:', error);
          setError('게시글 데이터를 불러올 수 없습니다.');
        }
      };
      fetchPost();
    }

    const fetchComments = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/api/comments?postId=${id}`);
        setComments(response.data);
      } catch (error) {
        console.error('댓글 데이터를 가져오는 중 오류 발생:', error);
      }
    };
    fetchComments();
  }, [id, post]);

  // 댓글 등록
  const handleAddComment = async () => {
    if (!newComment.trim()) {
      alert('댓글 내용을 입력하세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/api/comments', {
        postId: id,
        content: newComment,
      });
      setComments([...comments, { id: response.data.id, content: newComment }]);
      setNewComment('');
      alert('댓글이 등록되었습니다.');
    } catch (error) {
      console.error('댓글 등록 중 오류 발생:', error.response?.data || error.message);
      alert('댓글 등록에 실패했습니다.');
    }
  };

  if (error) {
    return (
      <div>
        <Header />
        <div className="post-detail-container">
          <button className="back-button" onClick={() => navigate(-1)}>뒤로 가기</button>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!post) return <p>로딩 중...</p>;

  return (
    <div>
      <Header />
      <div className="post-detail-container">
        {/* 게시글 제목 및 내용 */}

        <div className="post-metadata">
          <h2 className="post-title">{post.title}</h2>
          <div className="post-info">
            <span>작성자: 익명</span>
            <span>작성일: {new Date(post.created_at).toLocaleDateString()}</span>
            <span>조회수: {post.views || 0}</span>
          </div>
        </div>
        <hr className="divider" />
        <div className="post-content">
          {post.content.split('\n').map((line, index) => (
            <p key={index}>{line}</p>
          ))}
        </div>

        {/* 댓글 섹션 */}
        <div className="comment-section">
          <h3>댓글</h3>

          {/* 댓글 입력 */}
          <textarea
            className="comment-input"
            placeholder="댓글을 입력하세요..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          ></textarea>
          <div className="comment-actions">
            <div className="comment-icons">
              <button className="emoji-button">😀 디시콘</button>
              <button className="help-button">?</button>
            </div>
            <div className="comment-buttons">
              <button className="submit-button" onClick={handleAddComment}>
                등록
              </button>
              <button className="submit-recommend-button">
                등록 + 추천
              </button>
            </div>
          </div>
          <ul className="comment-list">
            {comments.map((comment) => (
              <li key={comment.id} className="comment-item">
                {comment.content}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default PostDetail;
