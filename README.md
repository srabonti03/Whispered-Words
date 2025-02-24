# Whispered Words

**Whispered Words** is an online bookstore project designed to offer users an immersive shopping experience. Built with the **MERN Stack** (MongoDB, Express.js, React.js, Node.js), the project features a sleek, minimalist design using **Tailwind CSS** for the frontend. The platform allows users to browse books, add them to favorites, view events, and more.

## Project Features

- **Responsive Design**: Optimized for both desktop and mobile devices.
- **Book Browsing**: Users can view a curated list of books.
- **Favorites System**: Users can add books to their favorites list.
- **Admin Authentication**: Admin users can manage the catalog.
- **Event Page**: Users can view and engage with upcoming events related to books and authors.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **Backend**: Node.js, Express.js, MongoDB
- **State Management**: Redux for state management
- **Routing**: React Router for page navigation

## Setup Instructions

### Prerequisites

- Node.js
- MongoDB (for the backend)
- A code editor like VSCode

### Installation

#### 1. Clone the repository

To get started, first clone the repository to your local machine:

```bash
git clone https://github.com/srabonti03/Whispered-Words.git
```

#### 2. Set up Environment Variables

Navigate to the backend folder and create a .env file. In the .env file, add the following:

```bash
PORT=3001
URI=<Your MongoDB URI here>
```
Replace <Your MongoDB URI here> with your actual MongoDB URI.

#### 3. Install Dependencies

##### Backend:

Navigate to the backend directory and install the required dependencies:

```bash
cd backend
npm install
```

##### Frontend:

Navigate to the frontend directory and install the required dependencies:

```bash
cd frontend
npm install
```

### Run the Application

#### 1. Backend:

```bash
cd backend
nodemon app.js
```

#### 2. Frontend:

```bash
cd frontend
npm run dev
```

## View the Project

Once both servers are running, you can view the project by opening the following URL in your browser:

**Local:** [`http://localhost:5173/`](http://localhost:5173/)

You can expose it to your network using --host or press h + Enter to show help in the terminal.

## Contribution Guidelines

Feel free to fork this repository, open issues, and submit pull requests. All contributions are welcome!

## License

This project is licensed under the [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0).  
Please see the [LICENSE](LICENSE) file for more details.

### What's Included:

- **Clone the Repository**: Instructions to clone your project.
- **Set up Environment Variables**: How to configure the `.env` file.
- **Install Dependencies**: Steps for installing dependencies in both frontend and backend.
- **Run the Application**: Instructions to start both the backend and frontend servers.
- **View the Project**: The URL to access your project locally.
- **Contribution Guidelines**: Information for contributors.
- **License**: The project license.
