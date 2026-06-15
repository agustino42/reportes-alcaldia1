-- ========================================
-- Scripts de Configuración para Supabase
-- Proyecto: Sistema Barinas - Alcaldía
-- Copia y pega TODO en el SQL Editor en orden
-- ========================================

-- ========================================
-- 1. ACTIVAR REALTIME
-- ========================================
alter publication supabase_realtime add table "Incident";

-- ========================================
-- 2. HABILITAR RLS EN TODAS LAS TABLAS
-- ========================================
alter table "Incident" enable row level security;
alter table "User" enable row level security;
alter table "Comment" enable row level security;
alter table "Vote" enable row level security;
alter table "Employee" enable row level security;

-- ========================================
-- 3. POLÍTICAS RLS - TABLA INCIDENT
-- ========================================

-- Admin: acceso total
create policy "admin_full_access_incident" on "Incident"
  for all using (
    auth.jwt() ->> 'role' = 'admin'
  );

-- Técnico: ve incidentes de su departamento
create policy "technician_select_incident" on "Incident"
  for select using (
    auth.jwt() ->> 'role' = 'technician'
    and "assignedDepartment" = (auth.jwt() ->> 'department')
  );

-- Técnico: puede actualizar estado
create policy "technician_update_incident" on "Incident"
  for update using (
    auth.jwt() ->> 'role' = 'technician'
    and "assignedDepartment" = (auth.jwt() ->> 'department')
  );

-- Ciudadano autenticado: puede insertar reportes
create policy "citizen_insert_incident" on "Incident"
  for insert with check (
    auth.jwt() ->> 'role' = 'citizen'
    and "userId" = auth.uid()::text
  );

-- Ciudadano autenticado: solo ve sus reportes
create policy "citizen_select_incident" on "Incident"
  for select using (
    auth.jwt() ->> 'role' = 'citizen'
    and "userId" = auth.uid()::text
  );

-- ========================================
-- 4. POLÍTICAS RLS - TABLA USER
-- ========================================

-- Admin: acceso total
create policy "admin_full_access_user" on "User"
  for all using (auth.jwt() ->> 'role' = 'admin');

-- Usuario: solo ve su propio perfil
create policy "user_self_access" on "User"  
  for select using (
    auth.jwt() ->> 'role' = 'citizen'
    and id = auth.uid()::text
  );

-- ========================================
-- 5. POLÍTICAS RLS - TABLA COMMENT
-- ========================================

-- Admin: acceso total
create policy "admin_full_access_comment" on "Comment"
  for all using (auth.jwt() ->> 'role' = 'admin');

-- Ciudadano: puede ver comentarios de incidentes donde es dueño
create policy "citizen_select_comment" on "Comment"
  for select using (
    auth.jwt() ->> 'role' = 'citizen'
    and "incidentId" in (
      select id from "Incident" where "userId" = auth.uid()::text
    )
  );

-- Ciudadano: puede comentar en sus incidentes
create policy "citizen_insert_comment" on "Comment"
  for insert with check (
    auth.jwt() ->> 'role' = 'citizen'
    and "incidentId" in (
      select id from "Incident" where "userId" = auth.uid()::text
    )
    and "userId" = auth.uid()::text
  );

-- ========================================
-- 6. POLÍTICAS RLS - TABLA VOTE
-- ========================================

-- Admin: acceso total
create policy "admin_full_access_vote" on "Vote"
  for all using (auth.jwt() ->> 'role' = 'admin');

-- Ciudadano: puede votar en incidentes que le pertenecen
create policy "citizen_vote" on "Vote"
  for insert with check (
    auth.jwt() ->> 'role' = 'citizen'
    and "userId" = auth.uid()::text
    and "incidentId" in (
      select id from "Incident" where "userId" = auth.uid()::text
    )
  );

-- ========================================
-- 7. POLÍTICAS RLS - TABLA EMPLOYEE
-- ========================================

-- Admin: acceso total
create policy "admin_full_access_employee" on "Employee"
  for all using (auth.jwt() ->> 'role' = 'admin');

-- ========================================
-- 8. STORAGE: PERMITIR SUBIR FOTOS
-- ========================================
insert into storage.buckets (id, name, public)
values ('incident-photos', 'incident-photos', true)
on conflict (id) do update set public = true;
