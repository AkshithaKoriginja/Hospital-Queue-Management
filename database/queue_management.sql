-- ============================================
-- HOSPITAL QUEUE MANAGEMENT SYSTEM
-- DATABASE
-- ============================================

-- 1. Create the database
CREATE DATABASE hospital_queue;

-- 2. Select the database
USE hospital_queue;


-- ============================================
-- 3. PATIENTS TABLE
-- Stores patient information
-- ============================================

CREATE TABLE patients (
    patient_id INT AUTO_INCREMENT PRIMARY KEY,
    patient_name VARCHAR(100) NOT NULL,
    age INT,
    gender VARCHAR(20),
    phone VARCHAR(15)
);


-- ============================================
-- 4. DOCTORS TABLE
-- Stores doctor information
-- ============================================

CREATE TABLE doctors (
    doctor_id INT AUTO_INCREMENT PRIMARY KEY,
    doctor_name VARCHAR(100) NOT NULL,
    specialization VARCHAR(100),
    department VARCHAR(100)
);


-- ============================================
-- 5. QUEUES TABLE
-- Stores token and queue information
-- ============================================

CREATE TABLE queues (
    queue_id INT AUTO_INCREMENT PRIMARY KEY,

    patient_id INT NOT NULL,
    doctor_id INT NOT NULL,

    token_number INT NOT NULL,

    appointment_time DATETIME,

    status VARCHAR(30) DEFAULT 'Waiting',

    arrival_time DATETIME,
    start_time DATETIME,
    end_time DATETIME,

    waiting_time INT,

    -- Connect patient with queue
    FOREIGN KEY (patient_id)
        REFERENCES patients(patient_id),

    -- Connect doctor with queue
    FOREIGN KEY (doctor_id)
        REFERENCES doctors(doctor_id)
);


-- ============================================
-- 6. USERS TABLE
-- Stores admin/staff/doctor login information
-- ============================================

CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,

    username VARCHAR(50) NOT NULL UNIQUE,

    password VARCHAR(255) NOT NULL,

    role VARCHAR(30) NOT NULL
);
