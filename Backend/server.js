const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// دریافت تنظیمات Supabase از متغیرهای محیطی
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;

// بررسی وجود کلیدها
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ خطا: متغیرهای محیطی SUPABASE_URL یا SUPABASE_KEY تنظیم نشده‌اند!');
  console.error('لطفاً فایل .env را بررسی کنید.');
  process.exit(1);
}

// ایجاد کلاینت Supabase
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
console.log('✅ اتصال به Supabase با موفقیت برقرار شد!');

// middleware
app.use(cors());
app.use(express.json());

// مسیر ریشه
app.get('/', (req, res) => {
  res.json({
    message: 'به API ثبت نام کاربران خوش آمدید!',
    status: 'active',
    endpoints: {
      'POST /users': 'ثبت نام کاربر جدید',
      'GET /users': 'دریافت تمام کاربران',
      'GET /users/:user_id': 'دریافت اطلاعات یک کاربر',
      'DELETE /users/:user_id': 'حذف یک کاربر'
    }
  });
});

// ثبت نام کاربر جدید
app.post('/users', async (req, res) => {
  try {
    const { full_name, email, age } = req.body;

    // بررسی سن
    if (!age || age < 1 || age > 150) {
      return res.status(400).json({ detail: 'سن وارد شده معتبر نیست' });
    }

    // بررسی طول نام
    if (!full_name || full_name.trim().length < 2) {
      return res.status(400).json({ detail: 'نام وارد شده بسیار کوتاه است' });
    }

    // بررسی ایمیل
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ detail: 'لطفاً یک ایمیل معتبر وارد کنید' });
    }

    // ارسال داده به Supabase
    const { data, error } = await supabase
      .from('users')
      .insert({
        full_name: full_name.trim(),
        email: email.toLowerCase().trim(),
        age: parseInt(age)
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return res.status(400).json({ detail: 'این ایمیل قبلاً ثبت شده است' });
      }
      throw error;
    }

    res.json({
      success: true,
      message: 'کاربر با موفقیت ثبت شد!',
      data: data
    });

  } catch (error) {
    console.error('خطا در ثبت کاربر:', error);
    res.status(500).json({ detail: `خطای سرور: ${error.message}` });
  }
});

// دریافت تمام کاربران
app.get('/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('id', { ascending: false });

    if (error) throw error;

    res.json({
      success: true,
      total: data.length,
      data: data
    });

  } catch (error) {
    console.error('خطا در دریافت کاربران:', error);
    res.status(500).json({ detail: `خطا در دریافت کاربران: ${error.message}` });
  }
});

// دریافت یک کاربر خاص
app.get('/users/:user_id', async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ detail: 'کاربر یافت نشد' });
      }
      throw error;
    }

    res.json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error('خطا در دریافت کاربر:', error);
    res.status(500).json({ detail: `خطا در دریافت کاربر: ${error.message}` });
  }
});

// حذف یک کاربر
app.delete('/users/:user_id', async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id);

    // بررسی وجود کاربر
    const { data: checkData, error: checkError } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single();

    if (checkError) {
      if (checkError.code === 'PGRST116') {
        return res.status(404).json({ detail: 'کاربر یافت نشد' });
      }
      throw checkError;
    }

    // حذف کاربر
    const { error: deleteError } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (deleteError) throw deleteError;

    res.json({
      success: true,
      message: `کاربر با شناسه ${userId} با موفقیت حذف شد`
    });

  } catch (error) {
    console.error('خطا در حذف کاربر:', error);
    res.status(500).json({ detail: `خطا در حذف کاربر: ${error.message}` });
  }
});

// آمار کلی
app.get('/stats', async (req, res) => {
  try {
    const { count, error } = await supabase
      .from('users')
      .select('id', { count: 'exact', head: true });

    if (error) throw error;

    res.json({
      success: true,
      total_users: count
    });

  } catch (error) {
    console.error('خطا در دریافت آمار:', error);
    res.status(500).json({ detail: `خطا در دریافت آمار: ${error.message}` });
  }
});

// اجرای سرور
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 سرور روی http://0.0.0.0:${PORT} در حال اجرا است`);
});

module.exports = app;
