-- SURA (Suara Rakyat) Database Schema
-- PostgreSQL database schema for citizen reporting platform
-- Supports both web and mobile applications

-- Enable UUID extension for unique identifiers
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PostGIS disabled due to architecture compatibility issues
-- Using plain latitude/longitude instead

-- =====================================================
-- USER MANAGEMENT TABLES
-- =====================================================

-- Users table - stores all user accounts
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20),
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin', 'moderator')),
    avatar_url TEXT,
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP WITH TIME ZONE
);

-- User profiles table - additional user information
CREATE TABLE user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    bio TEXT,
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(10),
    birth_date DATE,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    preferences JSONB DEFAULT '{}', -- Store user preferences
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- REPORTING SYSTEM TABLES
-- =====================================================

-- Categories for reports
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7), -- Hex color code
    is_active BOOLEAN DEFAULT TRUE,
    parent_id UUID REFERENCES categories(id), -- For subcategories
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Reports table - main reporting entity
CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES categories(id),
    user_id UUID REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'in_progress', 'resolved', 'rejected')),
    priority VARCHAR(10) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    
    -- Location information
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    
    -- Media attachments
    image_urls TEXT[], -- Array of image URLs
    video_url TEXT,
    
    -- Metadata
    is_anonymous BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

-- Report comments table
CREATE TABLE report_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    is_official BOOLEAN DEFAULT FALSE, -- Official response from authorities
    parent_id UUID REFERENCES report_comments(id), -- For threaded comments
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Report likes/votes
CREATE TABLE report_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    vote_type VARCHAR(10) CHECK (vote_type IN ('up', 'down')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(report_id, user_id)
);

-- =====================================================
-- ADMIN/MODERATION TABLES
-- =====================================================

-- Report assignments to moderators/admins
CREATE TABLE report_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id),
    assigned_by UUID REFERENCES users(id),
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'assigned' CHECK (status IN ('assigned', 'in_review', 'completed'))
);

-- Report status history for audit trail
CREATE TABLE report_status_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
    old_status VARCHAR(20),
    new_status VARCHAR(20),
    changed_by UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- NEWS/CONTENT TABLES
-- =====================================================

-- News articles
CREATE TABLE news_articles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    excerpt TEXT,
    author_id UUID REFERENCES users(id),
    category VARCHAR(100),
    image_url TEXT,
    is_published BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    tags TEXT[], -- Array of tags
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- COMMUNITY FORUM TABLES
-- =====================================================

-- Forum categories
CREATE TABLE forum_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    color VARCHAR(7),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Forum posts/discussions
CREATE TABLE forum_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    user_id UUID REFERENCES users(id),
    category_id UUID REFERENCES forum_categories(id),
    is_pinned BOOLEAN DEFAULT FALSE,
    is_locked BOOLEAN DEFAULT FALSE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    tags TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Forum comments
CREATE TABLE forum_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES forum_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id),
    content TEXT NOT NULL,
    parent_id UUID REFERENCES forum_comments(id), -- For threaded comments
    like_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- NOTIFICATION SYSTEM TABLES
-- =====================================================

-- Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL, -- report_update, news, system, etc.
    related_id UUID, -- ID of related entity (report, news, etc.)
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- MOBILE-SPECIFIC TABLES
-- =====================================================

-- Device tokens for push notifications
CREATE TABLE device_tokens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    token TEXT NOT NULL,
    platform VARCHAR(20) CHECK (platform IN ('ios', 'android')),
    device_info JSONB,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, token)
);

-- Offline sync queue for mobile
CREATE TABLE offline_sync_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    entity_type VARCHAR(50) NOT NULL, -- report, comment, etc.
    entity_data JSONB NOT NULL, -- The actual data to sync
    action VARCHAR(20) CHECK (action IN ('create', 'update', 'delete')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    synced_at TIMESTAMP WITH TIME ZONE,
    sync_status VARCHAR(20) DEFAULT 'pending' CHECK (sync_status IN ('pending', 'synced', 'failed'))
);

-- =====================================================
-- SYSTEM CONFIGURATION TABLES
-- =====================================================

-- System settings
CREATE TABLE system_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key VARCHAR(100) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE, -- Whether setting is accessible to public
    updated_by UUID REFERENCES users(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_is_active ON users(is_active);

-- Reports indexes
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_category_id ON reports(category_id);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_priority ON reports(priority);
CREATE INDEX idx_reports_created_at ON reports(created_at);

-- Report comments indexes
CREATE INDEX idx_report_comments_report_id ON report_comments(report_id);
CREATE INDEX idx_report_comments_user_id ON report_comments(user_id);
CREATE INDEX idx_report_comments_created_at ON report_comments(created_at);

-- News indexes
CREATE INDEX idx_news_articles_author_id ON news_articles(author_id);
CREATE INDEX idx_news_articles_is_published ON news_articles(is_published);
CREATE INDEX idx_news_articles_published_at ON news_articles(published_at);

-- Forum indexes
CREATE INDEX idx_forum_posts_user_id ON forum_posts(user_id);
CREATE INDEX idx_forum_posts_category_id ON forum_posts(category_id);
CREATE INDEX idx_forum_posts_created_at ON forum_posts(created_at);

-- Notifications indexes
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reports_updated_at BEFORE UPDATE ON reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_report_comments_updated_at BEFORE UPDATE ON report_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_news_articles_updated_at BEFORE UPDATE ON news_articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_posts_updated_at BEFORE UPDATE ON forum_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_forum_comments_updated_at BEFORE UPDATE ON forum_comments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (for development)
-- =====================================================

-- Insert default categories
INSERT INTO categories (name, description, icon, color, sort_order) VALUES
('Infrastruktur', 'Masalah jalan, drainase, dan fasilitas umum', 'engineering', '#2196F3', 1),
('Keamanan', 'Kriminalitas, keamanan lingkungan', 'security', '#F44336', 2),
('Lingkungan', 'Sampah, polusi, taman kota', 'park', '#4CAF50', 3),
('Sosial', 'Kegiatan kemasyarakatan, bantuan', 'groups', '#FF9800', 4),
('Kesehatan', 'Fasilitas kesehatan, layanan medis', 'local_hospital', '#9C27B0', 5),
('Pendidikan', 'Sekolah, fasilitas pendidikan', 'school', '#00BCD4', 6);

-- Insert default forum categories
INSERT INTO forum_categories (name, description, icon, color, sort_order) VALUES
('Info Warga', 'Informasi penting untuk warga', 'info', '#2196F3', 1),
('Diskusi Umum', 'Topik diskusi bebas', 'forum', '#4CAF50', 2),
('Konspirasi', 'Teori dan diskusi menarik', 'psychology', '#FF9800', 3),
('Masalah Hot', 'Isu-isu sedang trending', 'local_fire_department', '#F44336', 4),
('Kuliner Malam', 'Rekomendasi makanan', 'restaurant', '#795548', 5);

-- Insert system settings
INSERT INTO system_settings (key, value, description, is_public) VALUES
('app_name', 'SURA - Suara Rakyat', 'Application name', TRUE),
('maintenance_mode', 'false', 'Maintenance mode status', FALSE),
('max_file_size', '10485760', 'Maximum file upload size in bytes', FALSE),
('enable_push_notifications', 'true', 'Enable push notifications', FALSE);

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for reports with user and category info
CREATE VIEW report_details AS
SELECT 
    r.id,
    r.title,
    r.description,
    r.status,
    r.priority,
    r.latitude,
    r.longitude,
    r.address,
    r.image_urls,
    r.view_count,
    r.like_count,
    r.comment_count,
    r.created_at,
    r.updated_at,
    u.username,
    u.full_name,
    u.avatar_url,
    c.name as category_name,
    c.color as category_color
FROM reports r
LEFT JOIN users u ON r.user_id = u.id
LEFT JOIN categories c ON r.category_id = c.id;

-- View for user statistics
CREATE VIEW user_stats AS
SELECT 
    u.id,
    u.username,
    u.full_name,
    u.points,
    COUNT(r.id) as report_count,
    COUNT(rc.id) as comment_count,
    COALESCE(SUM(r.like_count), 0) as total_likes_received
FROM users u
LEFT JOIN reports r ON u.id = r.user_id
LEFT JOIN report_comments rc ON u.id = rc.user_id
GROUP BY u.id, u.username, u.full_name, u.points;
