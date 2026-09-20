import { Component, ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("RawFeed UI error:", error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel" role="alert" style={{ margin: "1rem", padding: "1.5rem" }}>
          <h2>Something went wrong</h2>
          <p style={{ color: "var(--color-text-muted)" }}>
            Please refresh the page. If this keeps happening, check that the backend is running.
          </p>
        </div>
      );
    }
    return this.props.children;
  }
}