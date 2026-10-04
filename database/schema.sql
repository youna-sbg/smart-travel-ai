-- ==========================================
-- Smart Travel AI Database Schema
-- Version: 1.0
-- ==========================================

-- ==========================================
-- Drop Tables (Development)
-- ==========================================

DROP TABLE IF EXISTS place_features CASCADE;
DROP TABLE IF EXISTS features CASCADE;
DROP TABLE IF EXISTS places CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS cities CASCADE;

-- ==========================================
-- Cities
-- ==========================================

CREATE TABLE cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL
);

-- ==========================================
-- Categories
-- ==========================================

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);

-- ==========================================
-- Places
-- ==========================================

CREATE TABLE places (
    id SERIAL PRIMARY KEY,

    city_id INTEGER NOT NULL REFERENCES cities(id),

    category_id INTEGER NOT NULL REFERENCES categories(id),

    name VARCHAR(255) NOT NULL,

    description TEXT,

    latitude DECIMAL(9,6),

    longitude DECIMAL(9,6),

    address TEXT,

    phone VARCHAR(20),

    opening_hours TEXT,

    website TEXT,

    instagram TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Features
-- ==========================================

CREATE TABLE features (
    id SERIAL PRIMARY KEY,

    name VARCHAR(100) NOT NULL UNIQUE
);

-- ==========================================
-- Place Features
-- ==========================================

CREATE TABLE place_features (

    place_id INTEGER NOT NULL REFERENCES places(id) ON DELETE CASCADE,

    feature_id INTEGER NOT NULL REFERENCES features(id) ON DELETE CASCADE,

    value SMALLINT NOT NULL CHECK (value BETWEEN 0 AND 10),

    PRIMARY KEY (place_id, feature_id)
);