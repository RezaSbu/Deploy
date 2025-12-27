import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:8000';

function App() {
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    age: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showUsers, setShowUsers] = useState(false);
  const [users, setUsers] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    // پاک کردن پیام خطا هنگام تغییر ورودی
    if (message.text) {
      setMessage({ type: '', text: '' });
    }
  };

  const validateForm = () => {
    if (!formData.full_name.trim()) {
      setMessage({ type: 'error', text: 'لطفاً نام و نام خانوادگی را وارد کنید' });
      return false;
    }
    if (formData.full_name.trim().length < 2) {
      setMessage({ type: 'error', text: 'نام وارد شده بسیار کوتاه است' });
      return false;
    }
    if (!formData.email.trim()) {
      setMessage({ type: 'error', text: 'لطفاً ایمیل را وارد کنید' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage({ type: 'error', text: 'لطفاً یک ایمیل معتبر وارد کنید' });
      return false;
    }
    if (!formData.age || formData.age < 1 || formData.age > 150) {
      setMessage({ type: 'error', text: 'لطفاً سن معتبر وارد کنید (بین ۱ تا ۱۵۰)' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(`${API_URL}/users`, {
        full_name: formData.full_name,
        email: formData.email,
        age: parseInt(formData.age)
      });

      if (response.data.success) {
        setMessage({ 
          type: 'success', 
          text: '✓ ثبت نام با موفقیت انجام شد!' 
        });
        setFormData({ full_name: '', email: '', age: '' });
        
        // به‌روزرسانی لیست کاربران
        fetchUsers();
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'خطا در ثبت نام. لطفاً دوباره تلاش کنید.';
      setMessage({ 
        type: 'error', 
        text: errorMessage 
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${API_URL}/users`);
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('خطا در دریافت کاربران:', error);
    }
  };

  const toggleUsersList = () => {
    if (!showUsers) {
      fetchUsers();
    }
    setShowUsers(!showUsers);
  };

  return (
    <div className="app-container">
      <div className="main-card">
        {/* هدر کارت */}
        <div className="card-header">
          <div className="icon-container">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <h1>فرم ثبت نام کاربران</h1>
          <p>اطلاعات خود را وارد کنید</p>
        </div>

        {/* فرم */}
        <form onSubmit={handleSubmit} className="registration-form">
          {/* فیلد نام و نام خانوادگی */}
          <div className="form-group">
            <label htmlFor="full_name">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              نام و نام خانوادگی
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              value={formData.full_name}
              onChange={handleChange}
              placeholder="نام کامل خود را وارد کنید"
              disabled={loading}
            />
          </div>

          {/* فیلد ایمیل */}
          <div className="form-group">
            <label htmlFor="email">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              ایمیل
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="example@email.com"
              disabled={loading}
            />
          </div>

          {/* فیلد سن */}
          <div className="form-group">
            <label htmlFor="age">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              سن
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="سن خود را وارد کنید"
              min="1"
              max="150"
              disabled={loading}
            />
          </div>

          {/* دکمه ثبت نام */}
          <button 
            type="submit" 
            className={`submit-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                در حال ثبت نام...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                ثبت نام
              </>
            )}
          </button>
        </form>

        {/* نمایش پیام */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
            )}
            {message.text}
          </div>
        )}

        {/* دکمه نمایش کاربران */}
        <button className="toggle-users-btn" onClick={toggleUsersList}>
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          {showUsers ? 'بستن لیست کاربران' : 'مشاهده کاربران ثبت شده'}
        </button>

        {/* لیست کاربران */}
        {showUsers && (
          <div className="users-list">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              کاربران ثبت شده ({users.length})
            </h3>
            {users.length === 0 ? (
              <p className="no-users">هیچ کاربری ثبت نشده است</p>
            ) : (
              <ul className="users-ul">
                {users.map((user, index) => (
                  <li key={user.id || index} className="user-item">
                    <div className="user-avatar">
                      {user.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="user-info">
                      <span className="user-name">{user.full_name}</span>
                      <span className="user-email">{user.email}</span>
                    </div>
                    <div className="user-age">
                      <span className="age-label">سن:</span>
                      <span className="age-value">{user.age}</span>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/* فوتر */}
        <div className="card-footer">
          <p>ساخته شده با ❤️ و React</p>
        </div>
      </div>
    </div>
  );
}

export default App;
