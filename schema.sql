-- Crear tabla profiles primero, ya que otras tablas dependen de ella
create table
  public.profiles (
    id uuid not null,
    created_at timestamp with time zone not null default now(),
    username text null default '""'::text,
    full_name text not null default '""'::text,
    image text null,
    constraint profiles_pkey primary key (id),
    constraint profiles_id_fkey foreign key (id) references auth.users (id) on update cascade on delete cascade
  ) tablespace pg_default;

-- Crear tabla documents
create table
  public.documents (
    id uuid not null default gen_random_uuid (),
    title text null,
    content text null,
    owner_id uuid null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone null default now(),
    is_public boolean not null default false,
    constraint documents_pkey primary key (id),
    constraint documents_owner_id_fkey foreign key (owner_id) references profiles (id) on update cascade on delete set null
  ) tablespace pg_default;

-- Crear tabla collaborators
create table
  public.collaborators (
    id uuid not null default gen_random_uuid (),
    created_at timestamp with time zone not null default now(),
    document_id uuid null,
    user_id uuid null,
    permission_level text not null default ''::text,
    constraint collaborators_pkey primary key (id),
    constraint unique_document_user unique (document_id, user_id),
    constraint collaborators_document_id_fkey foreign key (document_id) references documents (id) on update cascade on delete cascade,
    constraint collaborators_user_id_fkey foreign key (user_id) references profiles (id) on update cascade on delete cascade,
    constraint valid_permission_level check (
      (
        permission_level = any (array['author'::text, 'editor'::text])
      )
    )
  ) tablespace pg_default;

-- Crear vistas

-- Crear vista document_access
CREATE VIEW public.document_access AS
SELECT d.id AS document_id,
       d.owner_id AS user_id,
       'owner'::text AS access_type
FROM documents d
UNION ALL
SELECT c.document_id,
       c.user_id,
       c.permission_level AS access_type
FROM collaborators c;

-- Crear vista collaborator_access
CREATE VIEW public.collaborator_access AS
SELECT collaborators.document_id,
       collaborators.user_id
FROM collaborators;

-- Habilitar Row-Level Security para las tablas involucradas
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;

-- Crear políticas de RLS

-- Tabla: documents
CREATE POLICY documents_insert ON public.documents
    FOR INSERT
    TO authenticated
    WITH CHECK (owner_id = auth.uid());

CREATE POLICY documents_delete ON public.documents
    FOR DELETE
    TO authenticated
    USING (owner_id = auth.uid());

CREATE POLICY documents_select ON public.documents
    FOR SELECT
    TO authenticated
    USING ((EXISTS (SELECT 1
                    FROM document_access
                    WHERE document_access.document_id = documents.id
                      AND document_access.user_id = auth.uid())) OR (is_public = true));

CREATE POLICY documents_update ON public.documents
    FOR UPDATE
    TO authenticated
    USING (EXISTS (SELECT 1
                   FROM document_access
                   WHERE document_access.document_id = documents.id
                     AND document_access.user_id = auth.uid()))
    WITH CHECK (true);

-- Tabla: profiles
GRANT INSERT ON public.profiles TO anon;
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborators DISABLE ROW LEVEL SECURITY;

-- Tabla: collaborators
CREATE POLICY view_collaborators ON public.collaborators
    FOR SELECT
    TO authenticated
    USING (EXISTS (SELECT 1
                   FROM document_access
                   WHERE document_access.document_id = collaborators.document_id
                     AND document_access.user_id = auth.uid()));

CREATE POLICY manage_collaborators ON public.collaborators
    FOR INSERT
    TO authenticated
    WITH CHECK (EXISTS (SELECT 1
                        FROM documents
                        WHERE documents.id = collaborators.document_id
                          AND documents.owner_id = auth.uid()));

CREATE POLICY delete_collaborators ON public.collaborators
    FOR DELETE
    TO authenticated
    USING (EXISTS (SELECT 1
                   FROM documents
                   WHERE documents.id = collaborators.document_id
                     AND documents.owner_id = auth.uid()));

-- Crear funciones

-- Función: get_auth_uid
CREATE OR REPLACE FUNCTION public.get_auth_uid()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN auth.uid();
END;
$function$;

-- Función: get_user_documents
CREATE OR REPLACE FUNCTION public.get_user_documents(current_user_id uuid)
RETURNS TABLE(
  id uuid,
  title text,
  content text,
  created_at timestamp without time zone,
  updated_at timestamp without time zone,
  owner_id uuid
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY
  -- Documentos donde el usuario es propietario
  SELECT 
    d.id, 
    d.title, 
    d.content, 
    d.created_at::timestamp, -- Conversión explícita
    d.updated_at::timestamp, -- Conversión explícita
    d.owner_id
  FROM documents d
  WHERE d.owner_id = current_user_id

  UNION

  -- Documentos donde el usuario es colaborador
  SELECT 
    d.id, 
    d.title, 
    d.content, 
    d.created_at::timestamp, -- Conversión explícita
    d.updated_at::timestamp, -- Conversión explícita
    d.owner_id
  FROM documents d
  INNER JOIN collaborators c ON d.id = c.document_id
  WHERE c.user_id = current_user_id

  ORDER BY updated_at DESC;
END;
$function$;

-- Función: get_user_id_by_email
CREATE OR REPLACE FUNCTION public.get_user_id_by_email(email text)
RETURNS TABLE(id uuid)
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
BEGIN
  RETURN QUERY SELECT au.id FROM auth.users au WHERE au.email = $1;
END;
$function$;

-- Función: remove_collaborators_on_private
CREATE OR REPLACE FUNCTION public.remove_collaborators_on_private()
RETURNS trigger
LANGUAGE plpgsql
AS $function$
BEGIN
  -- Si el documento deja de ser público, elimina todos sus colaboradores
  IF OLD.is_public = TRUE AND NEW.is_public = FALSE THEN
    DELETE FROM collaborators WHERE document_id = OLD.id;
  END IF;

  RETURN NEW;
END;
$function$;
