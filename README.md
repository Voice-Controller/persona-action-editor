# Action Editor for Persona Actions

## Description
This project is a React-based web application that provides a JSON Schema Importer and Editor for Persona Actions. It allows users to create, edit, and manage action schemas for persona-based systems, with a user-friendly interface built using shadcn/ui components. The project is built using Vite for fast development and building.

## Features
- Create and edit action schemas
- Import and export JSON schemas
- Add, remove, and rename actions
- Configure action types, validators, and dependencies
- Add and edit examples for each action
- Responsive design with dark mode support
- Fast Refresh for quick development iterations

## Technologies Used
- React
- Vite
- Tailwind CSS
- shadcn/ui components
- Fontsource for Inter font

## Prerequisites
- Node.js (v14 or later)
- npm (v6 or later)

## Installation
1. Clone the repository:
   ```
   git clone https://github.com/your-username/action-editor.git
   cd action-editor
   ```

2. Install dependencies:
   ```
   npm install
   ```

## Development
This project uses Vite for development and building. Vite provides a faster and leaner development experience for modern web projects.

To start the development server with Hot Module Replacement (HMR):
```
npm run dev
```
The application will be available at `http://localhost:5173` (or another port if 5173 is in use).

## Building for Production
To create a production build:
```
npm run build
```
The built files will be in the `dist` directory.

## Usage
1. Use the "Add Action" button to create new actions.
2. Click on an action to expand its details and edit its properties.
3. Use the "Import" and "Export" buttons to manage JSON schemas.
4. Configure action types, validators, and dependencies as needed.
5. Add examples to illustrate the usage of each action.

## Vite Plugins
This template uses the official Vite plugin for React. There are two options available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

The choice between these plugins depends on your specific needs. By default, this project uses `@vitejs/plugin-react`.

## Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## License
[MIT License](LICENSE)

## Acknowledgements
- [shadcn/ui](https://ui.shadcn.com/) for the component library
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for the build tool and development server
- [React](https://reactjs.org/) for the UI library