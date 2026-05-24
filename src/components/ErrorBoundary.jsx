import { Component } from "react";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    // Keeps crash logs in console for prototype debugging.
    console.error("Prototype render error:", error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="app-error-fallback-wrap">
          <article className="surface-card app-error-fallback">
            <h1>Something went wrong in the prototype.</h1>
            <button type="button" className="btn btn-gradient" onClick={() => window.location.reload()}>
              Reload App
            </button>
          </article>
        </div>
      );
    }

    return this.props.children;
  }
}
