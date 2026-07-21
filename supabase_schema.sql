-- =========================================================================
-- DRAGON GYM - COMPREHENSIVE SUPABASE POSTGRESQL SCHEMA & SEED DATA
-- Project ID: pejusobmvemzjbtzeurm
-- =========================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Table: eqx_user_profiles (Socios)
create table if not exists eqx_user_profiles (
    id varchar(50) primary key,
    name varchar(100) not null,
    email varchar(100) unique not null,
    phone varchar(30),
    blood_type varchar(10),
    emergency_contact text,
    avatar_letter varchar(5) default 'U',
    check_in_count integer default 0,
    check_in_goal integer default 3,
    membership_level varchar(50) default 'Plan Mensual Estándar',
    favorite_club varchar(100) default 'Dragon Gym Polanco',
    visits_30_days integer default 0,
    objective text default 'Hipertrofia de Piernas y Fuerza',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Table: eqx_classes (Clases del Club)
create table if not exists eqx_classes (
    id uuid default uuid_generate_v4() primary key,
    title varchar(150) not null,
    category varchar(50) check (category in ('HIIT', 'Funcional', 'Pilates', 'Running', 'Cycling', 'Strength')),
    instructor varchar(100) not null,
    location varchar(100) not null,
    duration integer not null, -- duration in minutes
    time_slot varchar(20) not null, -- e.g. "10:30 AM"
    date_slot varchar(50) not null, -- e.g. "Hoy", "Mañana"
    level varchar(50) default 'All Levels',
    image_url text,
    description text,
    strength_rank integer default 1 check (strength_rank between 1 and 5),
    cardio_rank integer default 1 check (cardio_rank between 1 and 5),
    athleticism_rank integer default 1 check (athleticism_rank between 1 and 5),
    is_exclusive boolean default false,
    capacity integer default 25,
    booked_count integer default 0,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Table: eqx_check_ins (Registro de Accesos)
create table if not exists eqx_check_ins (
    id uuid default uuid_generate_v4() primary key,
    user_id varchar(50) references eqx_user_profiles(id) on delete cascade,
    area_name varchar(50) not null, -- e.g. "musculacion", "cardio", "recepcion"
    check_in_time timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Table: eqx_sales (Compras e Historial de Tienda - Recomendadora de Suplementos)
create table if not exists eqx_sales (
    id uuid default uuid_generate_v4() primary key,
    user_id varchar(50) references eqx_user_profiles(id) on delete cascade,
    product_name varchar(100) not null, -- e.g. "Creatina monohidratada", "Proteína Whey"
    category varchar(50) not null, -- e.g. "Suplementos", "Membresías", "Accesorios"
    amount numeric(10,2) not null,
    quantity integer default 1,
    purchase_date timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Table: eqx_routines (Rutinas Prescritas por el Coach / IA Generadora)
create table if not exists eqx_routines (
    id uuid default uuid_generate_v4() primary key,
    user_id varchar(50) references eqx_user_profiles(id) on delete cascade,
    title varchar(150) not null,
    objective varchar(100) not null,
    level varchar(50) not null,
    duration_weeks integer default 4,
    exercises jsonb not null default '[]'::jsonb, -- Store list of moves, sets, reps
    is_approved boolean default false, -- Coach approval flow
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Table: eqx_cameras_log (Logs de Visión por Computadora YOLOv8)
create table if not exists eqx_cameras_log (
    id uuid default uuid_generate_v4() primary key,
    camera_name varchar(50) not null, -- 'musculacion' | 'cardio' | 'recepcion'
    camera_count integer not null, -- detected bodies
    app_count integer not null, -- check-ins in database
    discrepancy boolean default false,
    alerts jsonb default '[]'::jsonb, -- list of warning strings
    saturation integer not null, -- density percentage
    checked_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Table: eqx_announcements (Avisos Generales)
create table if not exists eqx_announcements (
    id uuid default uuid_generate_v4() primary key,
    title varchar(200) not null,
    content text not null,
    priority varchar(20) check (priority in ('Alta', 'Normal')) default 'Normal',
    date_label varchar(50) not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =========================================================================
-- SEED DATA FOR DEMO AND INITIAL DEPLOYMENT
-- =========================================================================

-- Insert initial users (SOCIOS)
insert into eqx_user_profiles (id, name, email, phone, blood_type, emergency_contact, avatar_letter, check_in_count, check_in_goal, membership_level, visits_30_days, objective)
values 
('DG-ATHLETE-7102', 'Molly Jones', 'molly.jones@dragongym.com', '+52 (55) 3819-9921', 'O+', 'David Jones (Esposo) - +52 (55) 3810-0022', 'M', 2, 3, 'VIP Dragon Pass', 14, 'Acondicionamiento Físico & Resistencia'),
('DG-ATHLETE-2210', 'John Doe', 'john.doe@gmail.com', '+52 (55) 1234-5678', 'A+', 'Jane Doe (Madre) - +52 (55) 5555-4444', 'J', 0, 4, 'Plan Mensual Estándar', 0, 'Hipertrofia de Piernas y Fuerza'),
('DG-ATHLETE-4099', 'Sarah Connor', 'sarah.connor@cyberdyne.com', '+52 (55) 9999-8888', 'AB-', 'John Connor (Hijo) - +52 (55) 1111-2222', 'S', 2, 5, 'Plan Anual Elite', 2, 'Fuerza Funcional y Resistencia'),
('DG-ATHLETE-4512', 'Kyle Reese', 'kyle.reese@resistance.org', '+52 (55) 8888-7777', 'O-', 'John Connor - +52 (55) 1111-2222', 'K', 1, 5, 'Plan Mensual Estándar', 1, 'Acondicionamiento Físico de Combate')
on conflict (id) do nothing;

-- Insert initial supplement sales (RECOMENDACIÓN TIENDA)
insert into eqx_sales (user_id, product_name, category, amount, quantity, purchase_date)
values
('DG-ATHLETE-7102', 'Creatina Monohidratada 500g', 'Suplementos', 45.00, 1, now() - interval '3 weeks'),
('DG-ATHLETE-2210', 'Proteína Whey Isolate 1kg', 'Suplementos', 75.00, 1, now() - interval '5 weeks'),
('DG-ATHLETE-4099', 'Guantes de entrenamiento', 'Accesorios', 25.00, 1, now() - interval '2 weeks')
on conflict do nothing;

-- Insert initial gym classes
insert into eqx_classes (title, category, instructor, location, duration, time_slot, date_slot, level, image_url, description, strength_rank, cardio_rank, athleticism_rank, is_exclusive)
values
('Rompe Circuitos (Circuit Breaker)', 'HIIT', 'Adrianne G.', 'Estudio 1, Polanco', 45, '10:30 AM', 'Hoy', 'All Levels', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop', 'Exígete más en esta clase de circuito cargada de cardio.', 4, 5, 5, true),
('Acondicionamiento Metabólico 3 (MetCon3)', 'Strength', 'Kaisa K.', 'Piso Principal, Roma Norte', 50, '12:15 PM', 'Hoy', 'Intermediate', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop', 'MetCon3 desafía tu umbral anaeróbico y desarrolla músculo.', 5, 4, 4, true)
on conflict do nothing;

-- Build indexes for high operational speed
create index if not exists idx_check_ins_user on eqx_check_ins(user_id);
create index if not exists idx_sales_user on eqx_sales(user_id);
create index if not exists idx_routines_user on eqx_routines(user_id);
create index if not exists idx_cameras_log_name on eqx_cameras_log(camera_name);

-- Turn on Row Level Security (RLS) for compliance and privacy
alter table eqx_user_profiles enable row level security;
alter table eqx_routines enable row level security;
alter table eqx_check_ins enable row level security;

-- Setup public access policies (for simple demonstration)
create policy "Allow all read on eqx_user_profiles" on eqx_user_profiles for select using (true);
create policy "Allow all read on eqx_routines" on eqx_routines for select using (true);
create policy "Allow insert on eqx_check_ins" on eqx_check_ins for insert with check (true);
