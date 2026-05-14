
-- Allow anonymous resume submissions
ALTER TABLE public.resumes ALTER COLUMN user_id DROP NOT NULL;

-- Allow anyone (including anon) to insert a resume
CREATE POLICY "anyone can submit a resume"
ON public.resumes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow anyone to update a resume by id (used for auto-save before sign-in).
-- Admin SELECT policy is unchanged so only admins can read.
CREATE POLICY "anyone can update own draft by id"
ON public.resumes
FOR UPDATE
TO anon, authenticated
USING (true)
WITH CHECK (true);

-- Allow anonymous photo uploads to avatars/public/*
CREATE POLICY "public avatar uploads"
ON storage.objects
FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = 'public');

CREATE POLICY "public avatar updates"
ON storage.objects
FOR UPDATE
TO anon, authenticated
USING (bucket_id = 'avatars' AND (storage.foldername(name))[1] = 'public')
WITH CHECK (bucket_id = 'avatars' AND (storage.foldername(name))[1] = 'public');
