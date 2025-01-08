# Mark-Collab

A real-time collaborative markdown editor platform that allows users to create, edit, and share markdown documents with others.

## Features

- Real-time collaborative editing
- Live markdown preview
- Document sharing and permissions management
- Chat system for collaborators
- Public/Private document settings
- User authentication
- Responsive design

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Backend**: Supabase (PostgreSQL + Real-time subscriptions)
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth

## Prerequisites

- Node.js (Latest LTS version recommended)
- npm or yarn
- A Supabase account and project

## Getting Started

1. Clone the repository:

   ```bash
   git clone https://github.com/salvarecuero/mark-collab.git
   cd mark-collab
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a Supabase project at [database.new](https://database.new)

4. Copy `.env.example` to `.env.local` and update the following variables:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   ```

5. Set up the database schema:

   ```bash
   npm run setup-db
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

The application should now be running at [http://localhost:3000](http://localhost:3000).

## Database Setup

The setup-db script will automatically:

1. Connect to your Supabase project
2. Create necessary tables and relationships
3. Set up row-level security policies
4. Enable real-time subscriptions
5. Configure authentication

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase project anonymous key
- `NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY`: Your Supabase project service role key

## Deployment

The easiest way to deploy Mark-Collab is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsalvarecuero%2Fmark-collab)

After deployment, make sure to:

1. Set up the environment variables in your Vercel project
2. Run the database setup script against your production Supabase instance

## License

MIT

## Author

Salvador Recuero
