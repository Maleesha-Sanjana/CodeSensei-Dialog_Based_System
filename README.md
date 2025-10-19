# CodeSensei - Dialogue-Based Desktop Learning Assistant

CodeSensei is an interactive, offline desktop application designed to help students learn programming concepts through dialogue-based interactions. It acts as a virtual coding mentor, providing clear explanations, code examples, and step-by-step guidance without requiring an internet connection.

## 🚀 Features

- **💬 Dialogue-based Learning**: Interactive chat interface for asking programming questions
- **📘 Comprehensive Knowledge Base**: Covers fundamental programming concepts including:
  - Variables and data types
  - Loops and iteration
  - Functions and methods
  - Conditional statements
  - Arrays and lists
  - Objects and dictionaries
  - Classes and OOP
  - Error handling
- **🧠 Offline Functionality**: Complete offline operation - no APIs or internet required
- **🎨 Modern UI**: Clean, responsive interface built with React and Tailwind CSS
- **📊 Progress Tracking**: Monitor learning progress and track topics explored
- **⚙️ Cross-platform**: Runs on macOS, Windows, and Linux

## 🛠️ Technology Stack

- **Frontend**: React + Vite
- **Desktop Shell**: Electron.js
- **Backend Logic**: Node.js (Electron main process)
- **Styling**: Tailwind CSS
- **Storage**: JSON files for knowledge base and user progress
- **State Management**: React Context API
- **Packaging**: Electron Builder

## 📋 Prerequisites

- Node.js (version 16 or higher)
- npm (comes with Node.js)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd CodeSensei
```

### 2. Install Dependencies
```bash
# Install main dependencies
npm install

# Install renderer dependencies (React app)
cd renderer
npm install
cd ..
```

### 3. Development Mode
```bash
# Start the application in development mode
npm run dev
```

This will:
- Start the Vite development server for the React frontend
- Launch the Electron application
- Enable hot reloading for development

### 4. Build for Production
```bash
# Build the application
npm run build

# Create distributable packages
npm run dist
```

## 📦 Building Distributables

### macOS
```bash
npm run dist:mac
```
Creates a `.dmg` file in the `dist` folder.

### Windows
```bash
npm run dist:win
```
Creates a `.exe` installer in the `dist` folder.

### Linux
```bash
npm run dist:linux
```
Creates an `AppImage` in the `dist` folder.

## 🎯 Usage

### Getting Started
1. Launch CodeSensei
2. Start by asking basic programming questions like:
   - "What is a variable?"
   - "How do loops work?"
   - "Explain functions"
   - "What are arrays?"

### Features Overview
- **Chat Interface**: Type questions in the input field at the bottom
- **Quick Suggestions**: Click on suggested questions to get started
- **Sidebar Menu**: Access different topics and features
- **Progress Tracking**: View your learning progress and statistics
- **Code Examples**: Interactive code examples with syntax highlighting

### Learning Tips
- Ask follow-up questions to deepen your understanding
- Try to explain concepts back to CodeSensei
- Practice with the provided code examples
- Explore related topics to build connections between concepts

## 📁 Project Structure

```
CodeSensei/
├── main.js                 # Electron main process
├── preload.js             # Secure IPC bridge
├── knowledge-base.json    # Programming concepts database
├── package.json           # Main package configuration
├── renderer/              # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # State management
│   │   └── App.jsx        # Main React component
│   └── package.json       # Frontend dependencies
└── dist/                  # Built application (after build)
```

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development mode
- `npm run dev:renderer` - Start only the React frontend
- `npm run dev:electron` - Start only the Electron app
- `npm run build` - Build for production
- `npm run dist` - Create distributable packages
- `npm run pack` - Package without creating installer

### Adding New Topics

To add new programming concepts to the knowledge base:

1. Edit `knowledge-base.json`
2. Add new topic objects with the following structure:
```json
{
  "id": "unique-topic-id",
  "title": "Topic Title",
  "description": "Brief description of the concept",
  "keywords": ["keyword1", "keyword2"],
  "difficulty": "beginner|intermediate|advanced",
  "category": "fundamentals|control-flow|data-structures|oop|advanced",
  "examples": [
    {
      "title": "Example Title",
      "description": "What this example demonstrates",
      "code": "// Code example here",
      "explanation": "Explanation of the code"
    }
  ],
  "commonQuestions": ["Question 1", "Question 2"]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Electron](https://electronjs.org/)
- Frontend powered by [React](https://reactjs.org/) and [Vite](https://vitejs.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons by [Lucide](https://lucide.dev/)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed information
3. Include your operating system and Node.js version

---

**Happy Learning! 🎓**

CodeSensei is designed to make programming concepts accessible and engaging. Whether you're a complete beginner or looking to reinforce your understanding, CodeSensei is here to help you on your coding journey.
