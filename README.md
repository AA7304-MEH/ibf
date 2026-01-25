# IBF (Innovator Bridge Foundry)

**Innovator Bridge Foundry (IBF)** is a comprehensive platform designed to bridge the gap between education, innovation, and industry. It integrates three core modules to support students, startups, and collaborators:

1.  **SkillSwap**: A gamified learning platform where students can acquire new skills through interactive roadmaps and peer-to-peer exchange.
2.  **Incubator**: A dedicated space for budding entrepreneurs to launch startups, find co-founders, and access resources like the "Founder Copilot."
3.  **Collaboration Hub (Collab)**: A marketplace for connecting talent with projects, enabling real-world experience and professional networking.

## Tech Stack

This project is built using a modern full-stack approach:

### Client (Frontend)
-   **Framework**: [React](https://react.dev/) with [Vite](https://vitejs.dev/)
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Routing**: React Router DOM (v6)
-   **Icons**: Lucide React, Heroicons, React Icons

### Server (Backend)
-   **Runtime**: [Node.js](https://nodejs.org/)
-   **Framework**: [Express.js](https://expressjs.com/)
-   **Database**: [MongoDB](https://www.mongodb.com/) (with Mongoose ODM)

## Getting Started

Follow these steps to set up the project locally.

### Prerequisites
-   Node.js (v18+ recommended)
-   npm or yarn
-   MongoDB installed locally or a MongoDB Atlas connection string

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/AA7304-MEH/ibf.git
    cd ibf
    ```

2.  **Install Client Dependencies**
    ```bash
    cd client
    npm install
    ```

3.  **Install Server Dependencies**
    ```bash
    cd ../server
    npm install
    ```

### Configuration

1.  **Server Environment Variables**
    Create a `.env` file in the `server` directory and add your configuration:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/ibf_db
    JWT_SECRET=your_jwt_secret_key
    ```
    *(Note: Adjust `MONGODB_URI` if using a cloud database)*

2.  **Client Environment Variables**
    (Optional) Create a `.env` file in the `client` directory if you have frontend-specific secrets (e.g., API keys).

### Running the Application

1.  **Start the Backend Server**
    ```bash
    # In the server directory
    npm run dev
    ```
    The server will start on `http://localhost:5000`.

2.  **Start the Frontend Development Server**
    ```bash
    # In the client directory
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Project Structure

```
ibf/
├── client/           # React Frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   │   ├── incubator/
│   │   │   ├── SkillSwap/
│   │   │   └── collab/
│   │   └── ...
│   └── ...
├── server/           # Express Backend
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── ...
│   └── ...
└── ...
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.
