// pages/mypage.js
import React, { useState } from "react";
import Header from "./Header";
import "./my_page.css";

function MyPage() {
  const [activeSection, setActiveSection] = useState("갤러리");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSectionClick = (section) => setActiveSection(section);

  const handlePostSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch(`http://localhost:3001/api/posts/${encodeURIComponent(activeSection)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });
      if (!response.ok) throw new Error("Error saving post");
      alert(`"${activeSection}"에 게시글이 저장되었습니다!`);
    } catch (error) {
      console.error("Error:", error);
      alert("게시글 저장에 실패했습니다.");
    }
  };

  return (
    <div>
      <Header />
      <div className="mypage-container">
        <div className="mypage-sidebar">
          <button className={activeSection === "갤러리" ? "active" : ""} onClick={() => handleSectionClick("갤러리")}>갤러리</button>
          <button className={activeSection === "미니갤" ? "active" : ""} onClick={() => handleSectionClick("미니갤")}>미니갤</button>
          <button className={activeSection === "인물갤" ? "active" : ""} onClick={() => handleSectionClick("인물갤")}>인물갤</button>
        </div>
        <div className="mypage-content">
          <h2>{activeSection} - 게시글 작성</h2>
          <form onSubmit={handlePostSubmit}>
            <input type="text" placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <textarea placeholder="내용을 입력하세요" value={content} onChange={(e) => setContent(e.target.value)} required></textarea>
            <button type="submit">게시글 올리기</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MyPage;
