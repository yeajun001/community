import React from 'react';

const UserList = () => {
    const users = [
        { email: 'user1@gmail.com', name: '예준' },
        { email: 'user2@gmail.com', name: '홍길동' },
        { email: 'user3@gmail.com', name: '예준2' },
        { email: 'user4@gmail.com', name: '홍길동2' }
    ];

    return (
        <div>
            <h2>사용자 목록</h2>
            <ul>
                {users.map((user, index) => (
                    <li key={index}>
                        이름: {user.name}, 이메일: {user.email}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
