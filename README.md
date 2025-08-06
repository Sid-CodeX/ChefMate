## ChefMate

**ChefMate** is a full-stack, AI-powered web application that serves as a personal cooking assistant. It provides an end-to-end solution for modern home cooks by streamlining the entire process of meal planning, recipe management, and grocery shopping.

-----

### Live Demo & Project Showcase

  * **Live Application**: [ChefMate](https://chefmate-aiapp.vercel.app/)

-----

### Key Features & Differentiators

  * **Intelligent Meal Planning**: A dynamic weekly calendar that allows users to effortlessly add, remove, and randomize meals. The user's meal plan state is persisted in a database, providing a seamless experience.
  * **AI-Powered Shopping List Generation** : An innovative feature that analyzes all planned meals and generates a consolidated, categorized shopping list. This eliminates the manual effort of creating grocery lists and ensures no ingredient is forgotten.
  * **AI Recipe Customization** : Users can modify any recipe based on specific dietary preferences (e.g., vegan, gluten-free) or cooking goals (e.g., quick-prep, high-protein). This is powered by an external AI service.
  * **Interactive AI Chat Assistant**: A dedicated chatbot, ChiefMate, provides real-time cooking advice and answers culinary questions, acting as a conversational kitchen companion.
  * **Robust User Authentication**: A secure and modern authentication system allows users to have personalized and private meal plans.

-----

### Architecture

ChefMate is designed with a **microservices-oriented architecture** that separates core application logic from specialized AI functionalities. This approach ensures scalability, modularity, and maintainability.

  * **ChefMate Backend (API)**: This is the central service that manages user authentication, stores and retrieves data from the PostgreSQL database (via Supabase), and handles all core business logic related to meal planning and recipe management.
  * **Hugging Face AI Service**: This is a dedicated, external service responsible for all AI-intensive tasks. The main backend communicates with this service via a REST API. This decouples the AI logic from the primary application, making it easy to update or swap AI models without affecting the rest of the system.

The endpoint for the AI service is:

  * **App URL**: `https://huggingface.co/spaces/sidharthp2004/ChefMate-LLM-API`
  * **Endpoint URL**: `https://sidharthp2004-chefmate-llm-api.hf.space`

-----

### Technology Stack

ChefMate is built on a modern and robust full-stack architecture, demonstrating proficiency in both frontend and backend development.

#### **Frontend**

  * **React & TypeScript**: Chosen for its component-based architecture and strong type-safety, ensuring a scalable and maintainable codebase.
  * **Tailwind CSS & Shadcn UI**: Utilized for rapid and responsive UI development with a consistent, production-ready design system.
  * **React Router**: Manages client-side routing, providing a smooth Single Page Application (SPA) experience.
  * **TanStack Query**: Manages server-side state, optimizing data fetching, caching, and synchronization.

#### **Backend**

  * **Node.js & Express.js**: A high-performance and lightweight framework that powers the RESTful API.
  * **PostgreSQL (via Supabase)**: A powerful relational database for storing user data, recipes, and meal plans. Supabase provides a managed, scalable solution.
  * **JSON Web Tokens (JWT)**: Implemented for secure, stateless authentication and API access control.

-----

### ⚙️ Installation and Setup

Follow these steps to get ChefMate up and running on your local machine.

#### **1. Prerequisites**

  * Node.js (v18 or higher)
  * npm or Yarn

#### **2. Clone the Repository**

```bash
git clone https://github.com/Sid-CodeX/ChefMate.git
cd ChefMate
```

#### **3. Backend Setup**

```bash
cd backend
npm install
cp .env.example .env
```

Fill in your `.env` file with your database and API keys.

#### **4. Frontend Setup**

```bash
cd ../frontend
npm install
cp .env.example .env
```

Fill in your `.env` file with your backend's API URL.

#### **5. Run the Application**

Start the backend server:

```bash
cd ../backend
npm run dev
```

Start the frontend development server:

```bash
cd ../frontend
npm run dev
```

The application should now be running locally and accessible at `http://localhost:8080`.

-----

### Roadmap & Future Scope

This project is a functional MVP with a clear path for future enhancements:

  * **Recipe & User Management**: Implement a full CRUD system for user-created recipes, including a personal recipe book and a favoriting system.
  * **Advanced AI Features**: Develop a personalized recipe recommendation engine based on user preferences and past meal plans.
  * **User Experience**: Refine the UI/UX with drag-and-drop functionality for the meal planner and advanced search filters for recipes.

-----

### Author

**Sidharth**

  * [**GitHub**](https://github.com/Sid-CodeX)
  * [**LinkedIn**](https://www.linkedin.com/in/sidharth-p-7b0097257/)
  * [**Portfolio**](https://sid-codex.vercel.app/)