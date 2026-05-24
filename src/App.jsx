import { Navigate, Route, Routes } from "react-router-dom";

import ErrorBoundary from "./components/ErrorBoundary";
import { QuizProvider } from "./context/QuizContext";
import Dashboard from "./pages/Dashboard";
import QuizPage from "./pages/QuizPage";
import ResultPage from "./pages/ResultPage";

export default function App() {
  return (
    <ErrorBoundary>
      <QuizProvider>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </QuizProvider>
    </ErrorBoundary>
  );
}
