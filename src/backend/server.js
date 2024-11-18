const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const secretKey = 'your_secret_key';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'signup', // 사용자 로그인 및 회원가입을 위한 데이터베이스
});

const db2 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'mypage', // 게시글 저장을 위한 데이터베이스
});

const db3 = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'input', // 댓글 데이터베이스
});

module.exports = { db, db2, db3 };

// JWT 토큰을 확인하고 사용자가 admin인지 확인하는 미들웨어
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access denied' });

  jwt.verify(token, secretKey, (err, user) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.user = user;
    next();
  });
};

// 게시글 삽입을 위한 API 엔드포인트
app.post('/api/posts/:section', (req, res) => {
  const section = decodeURIComponent(req.params.section);
  const { title, content } = req.body;

  let tableName;
  switch (section) {
    case '갤러리':
      tableName = 'gallery_table';
      break;
    case '미니갤':
      tableName = 'minigallery_table';
      break;
    case '인물갤':
      tableName = 'character_table';
      break;
    default:
      return res.status(400).json({ message: 'Invalid section' });
  }

  const query = `INSERT INTO ${tableName} (title, content) VALUES (?, ?)`;
  db2.query(query, [title, content], (error, results) => {
    if (error) {
      console.error('Error inserting data:', error);
      return res.status(500).json({ message: 'Error inserting data' });
    }
    res.json({ message: `Post saved to ${section}.` });
  });
});

// 카테고리별 게시글 가져오기 API 엔드포인트
app.get('/api/posts/:category', (req, res) => {
  const category = decodeURIComponent(req.params.category);
  let tableName;

  switch (category) {
    case '갤러리':
      tableName = 'gallery_table';
      break;
    case '미니갤':
      tableName = 'minigallery_table';
      break;
    case '인물갤':
      tableName = 'character_table';
      break;
    default:
      return res.status(400).json({ message: 'Invalid category' });
  }

  const query = `SELECT * FROM ${tableName}`;
  db2.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching data:', error);
      return res.status(500).json({ message: 'Error fetching data' });
    }
    res.json(results);
  });
});

// 게시글 삭제 API 엔드포인트 (관리자만 접근 가능)
app.delete('/api/posts/:category/:id', (req, res) => {
  const category = decodeURIComponent(req.params.category);
  const postId = req.params.id;
  let tableName;

  // 카테고리에 따른 테이블 이름 결정
  switch (category) {
    case '갤러리':
      tableName = 'gallery_table';
      break;
    case '미니갤':
      tableName = 'minigallery_table';
      break;
    case '인물갤':
      tableName = 'character_table';
      break;
    default:
      console.error('Invalid category:', category);
      return res.status(400).json({ message: 'Invalid category' });
  }

  // SQL 쿼리 실행
  const query = `DELETE FROM ${tableName} WHERE id = ?`;
  console.log(`Executing query: ${query}, with id: ${postId}`);

  db2.query(query, [postId], (error, results) => {
    if (error) {
      console.error('Database error:', error);
      return res.status(500).json({ message: 'Error deleting post' });
    }

    if (results.affectedRows === 0) {
      console.error('No post found with the given id:', postId);
      return res.status(404).json({ message: 'Post not found' });
    }

    console.log('Post deleted successfully:', results);
    res.json({ message: 'Post deleted successfully' });
  });
});



// 회원가입 API 엔드포인트
app.post('/signup', (req, res) => {
  const { id, username, password, email } = req.body;
  const query = 'INSERT INTO users (id, username, password, email) VALUES (?, ?, ?, ?)';
  db.query(query, [id, username, password, email], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send('Database error');
    } else {
      res.status(200).send('User registered successfully');
    }
  });
});

// 로그인 API 엔드포인트
app.post('/login', (req, res) => {
  const { id, password } = req.body;

  const query = 'SELECT * FROM users WHERE id = ? AND password = ?';
  db.query(query, [id, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.status(500).send('Database error');
    } else if (results.length > 0) {
      const token = jwt.sign({ id }, secretKey, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });
});
app.get('/api/user', (req, res) => {
  const token = req.headers.authorization; // 헤더에서 토큰 가져오기

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    res.json({ username: user.id }); // JWT에서 사용자 ID 반환
  });
});


// 금지어 리스트
const prohibitedWords = ['씨발', '개새끼', '병신'];

// 욕설 필터링 함수
const filterComment = (comment) => {
  let filteredComment = comment;
  prohibitedWords.forEach((word) => {
    const regex = new RegExp(word, 'gi'); // 대소문자 구분 없이 필터링
    filteredComment = filteredComment.replace(regex, '**');
  });
  return filteredComment;
};

// 욕설 탐지 함수
const containsProhibitedWords = (comment) => {
  return prohibitedWords.some((word) => comment.toLowerCase().includes(word.toLowerCase()));
};

// 댓글 저장 API
app.post('/api/comments', (req, res) => {
  const { postId, content } = req.body;

  if (!postId || !content) {
    return res.status(400).json({ message: 'postId와 content를 모두 제공해야 합니다.' });
  }

  // 욕설 포함 여부 확인
  if (containsProhibitedWords(content)) {
    return res.status(400).json({ message: '욕설이 포함된 댓글은 등록할 수 없습니다.' });
  }

  const filteredContent = filterComment(content); // 필터링 처리

  const query = 'INSERT INTO comments (post_id, content) VALUES (?, ?)';
  db3.query(query, [postId, filteredContent], (err, result) => {
    if (err) {
      console.error('댓글 저장 중 오류 발생:', err);
      return res.status(500).json({ message: '댓글 저장 중 오류가 발생했습니다.' });
    }
    res.status(201).json({ message: '댓글이 등록되었습니다.', id: result.insertId });
  });
});

// 댓글 조회 API
app.get('/api/comments', (req, res) => {
  const { postId } = req.query;

  if (!postId) {
    return res.status(400).json({ message: 'postId를 제공해야 합니다.' });
  }

  const query = 'SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC';
  db3.query(query, [postId], (err, results) => {
    if (err) {
      console.error('댓글 가져오기 중 오류 발생:', err);
      return res.status(500).json({ message: '댓글 가져오기 중 오류가 발생했습니다.' });
    }
    res.json(results);
  });
});




// 서버 시작
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
