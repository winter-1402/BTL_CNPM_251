IF DB_ID('CNPM') IS NULL
    CREATE DATABASE CNPM;
GO

USE CNPM;
GO
-- Users table
CREATE TABLE users (
 id int IDENTITY(0,1) primary key NOT NULL,
 username NVARCHAR(255) NOT NULL UNIQUE,
 email NVARCHAR(255) NOT NULL UNIQUE,
 passwords NVARCHAR(255) NOT NULL,
 roles NVARCHAR(20) NOT NULL
);
GO
-- Tutors table
CREATE TABLE tutors (
    id int IDENTITY(0,1) PRIMARY KEY,
    users_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tong_hoc_sinh int ,
    tong_buoi_thang_nay int,
    rating DECIMAL(3,2) DEFAULT 0.0,
);

GO

-- Students table
CREATE TABLE students (
    id int IDENTITY(0,1) PRIMARY KEY,
    MSSV bigint UNIQUE NOT NULL,
    users_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    tong_buoi_hoc int ,
    gio_hoc int,
);
GO

CREATE TABLE available (
    availability_Id int IDENTITY(0,1) primary key NOT NULL,
    tutorId int NOT NULL,
    startTime TEXT,
    endTime TIME,
    created_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (tutorId) REFERENCES tutors(id) ON DELETE CASCADE,
);
GO


CREATE TABLE booked(
  id int IDENTITY(0,1) primary key NOT NULL,
  availability_Id int REFERENCES available(availability_Id) ON DELETE SET NULL,
  student_id int REFERENCES students(id), 
  booked_types VARCHAR(255),
  topic NVARCHAR(255),

);
GO

CREATE TABLE buoi_hoc (
  buoi_hoc_Id int NOT NULL,
  tutorId int NOT NULL REFERENCES tutors(id) ,
  studentId int NOT NULL REFERENCES students(id),
  thoi_gian DATETIME NOT NULL,
  thoi_luong int,
  kieu NVARCHAR(255),
  topic NVARCHAR(255),
  dia_diem NVARCHAR(255),
  duong_link NVARCHAR(255),
  notes NVARCHAR(MAX),
  tien_do int check (tien_do between 0 and 100),
  created_at DATETIME DEFAULT GETDATE(),
  cancelled_at DATETIME,
  cancelled_by INTEGER REFERENCES tutors(id) ,
  cancellation_reason TEXT

);
GO

CREATE TABLE feedback (
    feedbackId int IDENTITY(0,1) primary key NOT NULL,
    studentId int NOT NULL REFERENCES students(id),
    tutorId int NOT NULL REFERENCES tutors(id), 
    rating DECIMAL(3,2) CHECK (rating BETWEEN 0 AND 5),
    an_danh BIT default 0,
    comments NVARCHAR(MAX),
    submitted_at DATETIME DEFAULT GETDATE()
);
GO

CREATE TABLE notifications (
    id int PRIMARY KEY,
    users_id INTEGER NOT NULL,
    message_content TEXT NOT NULL,
    is_read BIT DEFAULT 0,
    created_at dateTIME DEFAULT GETDATE(),
    read_at DATETIME
    FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE CASCADE
);
GO

CREATE TABLE library_source(
    resourceId int primary key NOT NULL,
    title TEXT,
    category TEXT,
    urls TEXT,
    descriptions TEXT,
    uploadedBy INTEGER REFERENCES users(id),
    uploadedAt DATETIME DEFAULT GETDATE()
);
GO

INSERT INTO users(username, email, passwords , roles) VALUES
(N'Nguy?n V?n An', N'an.nguyen@hcmut.edu.vn', N'student123' , N'student'),
(N'Bùi Tu?n C??ng', N'cuong.0707@hcmut.edu.vn', N'07072005' , N'student'),
(N'TS. Tr?n V?n Minh', N'minh.tran@hcmut.edu.vn', N'tutor123' , N'tutor'),
(N'TS. Hu?nh Duy Ch??ng', N'chuong@hcmut.edu.vn', N'123@a' , N'tutor'),
(N'Qu?n tr? viên H? th?ng', N'admin@hcmut.edu.vn', N' admin123' , N'admin'),
(N'Hoàng V?n Khánh', N'khanh.hoang@hcmut.edu.vn', N'07072005' , N'student'),
(N'Võ Th? Lan', N'lan.vo@hcmut.edu.vn', N'student234' , N'student'),
(N'Lê Th? Mai', N'mai.le@hcmut.edu.vn', N'student567' , N'student'),
(N'Tr?n V?n ??c', N'duc.tran@hcmut.edu.vn', N'student789' , N'student'),
(N'PhD. Nguy?n Thành Long', N'long.nguyen@hcmut.edu.vn', N'tutor123' , N'tutor'),
(N'MSC. Lê Th? Hoa', N'hoa.le@hcmut.edu.vn', N'123@a' , N'tutor'),
(N'TS. Hoàng V?n Khánh ', N'khanh.hoang1@hcmut.edu.vn', N'tutor123' , N'tutor'),
(N'MSC. Ph?m Th? Lan', N'lan@hcmut.edu.vn', N'123@a' , N'tutor')
GO
 
INSERT INTO tutors(users_id,tong_hoc_sinh,tong_buoi_thang_nay,rating) VALUES
(2, 156, 18,4.9 ),
(3, 172, 32,3.6),
(9, 124, 25,2.9 ),
(10, 130, 21,3.7),
(11, 136, 29,4.7 ),
(12, 162, 19,3.9)

GO

INSERT INTO students(users_id,MSSV,tong_buoi_hoc,gio_hoc) VALUES
(0,1810123, 24, 36 ),
(1,2310766, 72, 52),
(5,1811234, 72, 52),
(6,1811567, 72, 52),
(7,1810456, 72, 52),
(8,1810789, 72, 52)
GO

INSERT INTO available(tutorId,startTime,endTime)  VALUES
(0,N'Th? Hai 14:00','16:00'),
(0,N'Th? T? 10:00','12:00'),
(0,N'Th? Sáu 15:00','17:00'),
(1,N'Th? Ba 16:00','18:00'),
(1,N'Th? N?m 9:00','11:00'),
(1,N'Th? Sáu 7:00','9:00')
GO

INSERT INTO booked (availability_Id, student_id,  booked_types, topic) VALUES
(0,2,N'Tr?c Ti?p',N'H?c Máy'),
(2,4,N'Tr?c tuy?n',N'C?u Trúc D? Li?u'),
(3,3,N'Tr?c tuy?n',N'Thu?t Toán'),
(4,2,N'Tr?c Ti?p',N'Công ngh? ph?n m?m')
GO

INSERT INTO buoi_hoc(buoi_hoc_Id, tutorId, studentId, thoi_gian, thoi_luong , kieu, topic , dia_diem , duong_link , notes,tien_do) VALUES
(0,0,1,'2025-10-27 14:00',90,N'Tr?c Ti?p',N'C?u Trúc D? Li?u & Thu?t Toán',N'H6-107',NULL,N'Sinh viên mu?n ôn l?i thu?t toán s?p x?p',85),
(0,0,3,'2025-10-27 14:00',90,N'Tr?c Ti?p',N'C?u Trúc D? Li?u & Thu?t Toán',N'H6-107',NULL,N'Sinh viên mu?n ôn l?i thu?t toán s?p x?p',85),
(0,0,4,'2025-10-27 14:00',90,N'Tr?c Ti?p',N'C?u Trúc D? Li?u & Thu?t Toán',N'H6-107',NULL,N'Sinh viên mu?n ôn l?i thu?t toán s?p x?p',85),
(0,0,5,'2025-10-27 14:00',90,N'Tr?c Ti?p',N'C?u Trúc D? Li?u & Thu?t Toán',N'H6-107',NULL,N'Sinh viên mu?n ôn l?i thu?t toán s?p x?p',85),
(1,0,3,'2025-10-28 10:00',60,N'Tr?c tuy?n',N'Thu?t Toán',NULL,N'https://meet.google.com/abc-defg-hij',N'Bu?i h?c ??u tiên - gi?i thi?u',0),
(2,0,3,'2025-10-29 15:00',90,N'Tr?c Ti?p',N'C?u Trúc D? Li?u',N'H6-307',NULL,N'C?u trúc d? li?u cây',60),
(3,1,2,'2025-10-24 14:00',75,N'Tr?c Ti?p',N'C?u Trúc D? Li?u',N'H3-302',NULL,N'Sinh viên mu?n ôn l?i stack',75),
(4,1,3,'2025-10-26 14:00',90,N'Tr?c tuy?n',N'Công ngh? ph?n m?m',NULL,N'https://meet.google.com/abc-defg-xyz',N'Sinh viên mu?n ôn l?i thu?t toán s?p x?p',30),
(4,1,2,'2025-10-26 14:00',90,N'Tr?c tuy?n',N'Công ngh? ph?n m?m',NULL,N'https://meet.google.com/abc-defg-xyz',N'Sinh viên mu?n ôn l?i thu?t toán s?p x?p',30),
(5,1,4,'2025-10-28 14:00',60,N'Tr?c Ti?p',N'Thu?t Toán',N'H6-507',NULL,N'Sinh viên mu?n ôn l?i thu?t toán s?p x?p',80),
(6,1,5,'2025-10-28 16:00',60,N'Tr?c Ti?p',N'Thu?t Toán',N'H6-507',NULL ,N'Bu?i h?c ??u tiên - gi?i thi?u',0),
(7,1,5,'2025-10-29 15:00',90,N'Tr?c tuy?n',N'Công ngh? ph?n m?m','H6-307',NULL,N'C?u trúc d? li?u cây',60)
GO

INSERT INTO feedback (studentId, tutorId, rating, an_danh, comments) VALUES
(1, 1, 4.5, 0, N'Th?y r?t kiên nh?n và gi?i thích rõ ràng.'),
(2, 0, 4.0, 1, N'Bài h?c h?u ích, c?n nhi?u ví d? h?n.');
GO

INSERT INTO library_source (resourceId, title, category, urls, descriptions, uploadedBy, uploadedAt) VALUES
(201, N'Data Structures and Algorithms - Complete Guide', N'C?u Trúc D? Li?u & Thu?t Toán', N'drive.google.com/1234', N'Comprehensive guide covering all fundamental data structures including arrays, linked lists, trees, graphs, and hash tables.', 5, '2025-10-15 10:00:00'), 
(202, N'Sorting Algorithms Explained', N'Thu?t Toán', N'youtube.com/pronounce', N'Video lecture series explaining bubble sort, quick sort, merge sort, and heap sort with visualizations.', 2, '2025-10-20 14:30:00'),
(203, N'SQL Database Design Patterns', N'Công ngh? ph?n m?m', N'drive.google.com/1234', N'Best practices and design patterns for relational database design, normalization, and optimization.', 5, '2025-10-18 10:00:00'), 
(204, N'Machine Learning Fundamentals', N'H?c Máy', N'youtube.com/pronounce', N'Introduction to supervised and unsupervised learning, neural networks, and deep learning basics.', 2, '2025-10-10 14:30:00'),
(205, N'Practice Problems - Data Structures', N'C?u Trúc D? Li?u', N'drive.google.com/1234', N'Collection of 100+ practice problems with solutions for mastering data structures.', 5, '2025-10-22 10:00:00'), 
(206, N'Software Design Principles', N'Công ngh? ph?n m?m', N'youtube.com/pronounce', N'SOLID principles, design patterns, and clean code practices for software development.', 2, '2025-12-10 14:30:00'),
(207, N'Graph Algorithms Workshop Recording', N'C?u Trúc D? Li?u', N'drive.google.com/1234', N'Complete workshop on graph traversal, shortest path algorithms, and minimum spanning trees.', 5, '2025-10-25 10:00:00'), 
(208, N'Python Programming Cheat Sheet', N'Công ngh? ph?n m?m', N'youtube.com/pronounce', N'Quick reference guide for Python syntax, built-in functions, and common libraries.', 2, '2025-08-10 14:30:00')
GO