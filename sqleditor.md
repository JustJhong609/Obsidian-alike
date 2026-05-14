# Supabase SQL Setup

Paste the following SQL into your Supabase SQL Editor to create the necessary table for the Obsidian-alike app.

```sql
-- Create the notes table
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows anyone to read/write (for MVP/starter purposes)
-- NOTE: In a production app, you should restrict this to authenticated users.
CREATE POLICY "Allow public access" 
ON public.notes 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Create a trigger to automatically update updated_at on change
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_notes_updated_at
BEFORE UPDATE ON public.notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### Table Structure
- `id`: Unique identifier (UUID).
- `title`: The note's title.
- `content`: The markdown content of the note.
- `created_at`: Creation timestamp.
- `updated_at`: Last modification timestamp (auto-managed by trigger).
