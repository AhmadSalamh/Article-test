# Article

This is a private project named "Article" that contains code for building a web application. The application focuses on fetching and customizing articles from different sources using React.

## Installation

To run this project locally, you have two options: running it with Docker or running it without Docker.

### Running with Docker

1. Clone the repository:
git clone <repository-url>

2. Navigate to the project directory:
  ```
 cd article

3. Build the Docker image:
docker run -p 3000:3000 article:latest
The application will be accessible at http://localhost:3000 in your browser.


### Running without Docker
If you prefer to run the project without Docker, follow these steps:

1. Clone the repository:
git clone <repository-url>

2. Navigate to the project directory:
cd article

3. Install the dependencies:
npm install

4. Start the development server:
npm run dev
The application will be accessible at http://localhost:3000 in your browser.


### Usage
After running the project, you can use the following scripts:

    npm run build: Builds the production-ready version of the application.
    npm run lint: Runs ESLint to perform linting and code style checks.
    npm run preview: Previews the production build locally.

### Dependencies
The project relies on the following dependencies:

    axios: A Promise-based HTTP client for making API requests.
    react: A JavaScript library for building user interfaces.
    react-dom: A package that serves as the entry point to the DOM and server renderers for React.
    react-router-dom: A routing library for React applications.
    scss: A CSS preprocessor that adds additional functionality to CSS.


### Development Dependencies
The project has the following development dependencies:

    @types/react: TypeScript type definitions for React.
    @types/react-dom: TypeScript type definitions for React DOM.
    @vitejs/plugin-react: A Vite plugin for React integration.
    eslint: A pluggable JavaScript linter.
    eslint-plugin-react: ESLint rules specific to React.
    eslint-plugin-react-hooks: ESLint plugin for rules of React Hooks.
    eslint-plugin-react-refresh: ESLint plugin for React Refresh.
    sass: A mature, stable, and powerful professional-grade CSS extension language.
    vite: A fast and opinionated web dev build tool.


Make sure to have the above dependencies installed to successfully run and develop the project.

Please note that the <repository-url> placeholder in the commands should be replaced with the actual URL of the repository.