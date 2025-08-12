# LanguageHelp Database Schema

## Core Tables

### Users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  user_type ENUM('client', 'interpreter', 'admin'),
  profile_picture_url TEXT,
  timezone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Interpreters
```sql
CREATE TABLE interpreters (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  languages JSONB, -- Array of language codes they speak
  specializations TEXT[], -- Medical, Legal, Business, etc.
  hourly_rate DECIMAL(10,2),
  availability_schedule JSONB, -- Weekly schedule
  rating DECIMAL(3,2) DEFAULT 5.00,
  total_sessions INTEGER DEFAULT 0,
  verification_status ENUM('pending', 'verified', 'rejected'),
  bio TEXT,
  experience_years INTEGER,
  certifications TEXT[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Booking Requests
```sql
CREATE TABLE booking_requests (
  id UUID PRIMARY KEY,
  client_id UUID REFERENCES users(id),
  interpreter_id UUID REFERENCES interpreters(id),
  source_language VARCHAR(10) NOT NULL,
  target_language VARCHAR(10) NOT NULL,
  session_type ENUM('video', 'phone', 'in_person'),
  scheduled_at TIMESTAMP,
  duration_minutes INTEGER DEFAULT 60,
  status ENUM('pending', 'accepted', 'declined', 'completed', 'cancelled'),
  urgency ENUM('immediate', 'within_hour', 'scheduled'),
  description TEXT,
  special_requirements TEXT,
  price DECIMAL(10,2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Sessions
```sql
CREATE TABLE sessions (
  id UUID PRIMARY KEY,
  booking_id UUID REFERENCES booking_requests(id),
  room_id VARCHAR(255), -- Agora/Twilio room ID
  status ENUM('waiting', 'active', 'completed', 'cancelled'),
  started_at TIMESTAMP,
  ended_at TIMESTAMP,
  recording_url TEXT,
  chat_transcript JSONB,
  client_rating INTEGER,
  interpreter_rating INTEGER,
  client_feedback TEXT,
  interpreter_feedback TEXT
);
```

### Real-time Notifications
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(50), -- 'booking_request', 'session_start', etc.
  title VARCHAR(255),
  message TEXT,
  data JSONB, -- Additional notification data
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
