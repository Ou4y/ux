/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useMemo, useReducer } from "react";

import { quizQuestions, scoringConfig } from "../data/mockData";

const initialState = {
  currentQuestionIndex: 0,
  selectedOptionId: null,
  showFeedback: false,
  score: 0,
  xpEarned: 0,
  coinsEarned: 0,
  answersHistory: [],
  eliminatedByQuestion: {},
  session: {
    quizTitle: "Science & Coding Practice",
    joinCode: null,
    studentName: "Tarek",
  },
};

const QuizContext = createContext(null);

function pickFiftyFiftyOptions(question, selectedOptionId) {
  const wrongOptionIds = question.options
    .filter((option) => option.id !== question.correctOptionId)
    .map((option) => option.id);

  if (wrongOptionIds.length <= 2) {
    return wrongOptionIds;
  }

  let keepWrongId = selectedOptionId && wrongOptionIds.includes(selectedOptionId)
    ? selectedOptionId
    : wrongOptionIds[Math.floor(Math.random() * wrongOptionIds.length)];

  if (!keepWrongId) {
    keepWrongId = wrongOptionIds[0];
  }

  return wrongOptionIds.filter((id) => id !== keepWrongId);
}

function quizReducer(state, action) {
  switch (action.type) {
    case "RESET":
      return { ...initialState };
    case "START_SESSION":
      {
        const payload = action.payload || {};
        return {
          ...initialState,
          session: {
            quizTitle: payload.quizTitle || initialState.session.quizTitle,
            joinCode: payload.joinCode || null,
            studentName: payload.studentName || initialState.session.studentName,
          },
        };
      }
    case "SELECT_OPTION":
      if (state.showFeedback) {
        return state;
      }
      return {
        ...state,
        selectedOptionId: action.payload.optionId,
      };
    case "USE_FIFTY_FIFTY": {
      if (state.showFeedback) {
        return state;
      }

      const question = quizQuestions[state.currentQuestionIndex];
      if (!question || !Array.isArray(question.options) || state.eliminatedByQuestion[question.id]) {
        return state;
      }

      const eliminated = pickFiftyFiftyOptions(question, state.selectedOptionId);

      return {
        ...state,
        eliminatedByQuestion: {
          ...state.eliminatedByQuestion,
          [question.id]: eliminated,
        },
      };
    }
    case "SUBMIT_ANSWER": {
      if (state.showFeedback || !state.selectedOptionId) {
        return state;
      }

      const question = quizQuestions[state.currentQuestionIndex];
      if (!question || !question.correctOptionId || !Array.isArray(question.options)) {
        return state;
      }

      const isCorrect = state.selectedOptionId === question.correctOptionId;
      const xpDelta = isCorrect ? scoringConfig.xpPerCorrect : 0;
      const coinsDelta = isCorrect ? scoringConfig.coinsPerCorrect : 0;

      return {
        ...state,
        showFeedback: true,
        score: state.score + (isCorrect ? 1 : 0),
        xpEarned: state.xpEarned + xpDelta,
        coinsEarned: state.coinsEarned + coinsDelta,
        answersHistory: [
          ...state.answersHistory,
          {
            questionId: question.id,
            questionText: question.question,
            selectedOptionId: state.selectedOptionId,
            correctOptionId: question.correctOptionId,
            isCorrect,
          },
        ],
      };
    }
    case "NEXT_QUESTION": {
      const isLastQuestion = state.currentQuestionIndex >= quizQuestions.length - 1;
      if (!state.showFeedback || isLastQuestion) {
        return state;
      }

      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        selectedOptionId: null,
        showFeedback: false,
      };
    }
    case "SKIP_QUESTION": {
      const isLastQuestion = state.currentQuestionIndex >= quizQuestions.length - 1;
      if (isLastQuestion) {
        return state;
      }

      return {
        ...state,
        currentQuestionIndex: state.currentQuestionIndex + 1,
        selectedOptionId: null,
        showFeedback: false,
      };
    }
    default:
      return state;
  }
}

export function QuizProvider({ children }) {
  const [state, dispatch] = useReducer(quizReducer, initialState);

  const actions = useMemo(
    () => ({
      resetQuiz: () => dispatch({ type: "RESET" }),
      startQuizSession: (payload) => dispatch({ type: "START_SESSION", payload }),
      selectOption: (optionId) => dispatch({ type: "SELECT_OPTION", payload: { optionId } }),
      useFiftyFifty: () => dispatch({ type: "USE_FIFTY_FIFTY" }),
      submitAnswer: () => dispatch({ type: "SUBMIT_ANSWER" }),
      goNext: () => dispatch({ type: "NEXT_QUESTION" }),
      skipQuestion: () => dispatch({ type: "SKIP_QUESTION" }),
    }),
    []
  );

  const value = useMemo(() => ({ ...state, ...actions }), [state, actions]);

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const context = useContext(QuizContext);
  if (!context) {
    throw new Error("useQuiz must be used within QuizProvider");
  }
  return context;
}
