# Obsidian Alike - Personal Knowledge Base

A minimalist, Obsidian-inspired personal knowledge base web app built with Next.js, React Flow, and Zustand.

## Features

- **Note Management**: Create, edit, and delete notes with autosave to LocalStorage.
- **Linking System**: Link notes using the `[[Note Title]]` syntax. Clickable links are automatically detected.
- **Auto-Note Creation**: Clicking a link to a non-existent note automatically creates it.
- **Backlink Tracking**: See which notes link to the current note in the right sidebar.
- **Graph View**: Visualize your note network using React Flow.
- **Animations**: Smooth transitions and UI interactions powered by Framer Motion.
- **Search**: Instant filtering of notes by title or content.
- **Keyboard Shortcuts**:
  - `Ctrl + N`: Create new note
  - `Ctrl + G`: Toggle Graph View

## Tech Stack

- **Framework**: Next.js (App Router)
- **State Management**: Zustand (with LocalStorage persistence)
- **Graph Visualization**: React Flow
- **Animations**: Framer Motion
- **Styling**: Tailwind CSS (v4)
- **Icons**: Lucide React
- **Markdown Rendering**: React Markdown

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd Obsidian-alike
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `src/store`: Zustand state management and persistence logic.
- `src/components`: UI components (Sidebar, Editor, Graph, etc.).
- `src/utils`: Link parsing and extraction logic.
- `src/types`: TypeScript interfaces.
- `src/hooks`: Custom React hooks (e.g., hydration handling).

## License

MIT
