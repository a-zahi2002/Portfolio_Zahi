import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-charcoal-950 text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
          {/* Background glows */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-cyan/5 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-purple/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-md w-full bg-charcoal-900/60 border border-white/8 rounded-2xl p-8 backdrop-blur-xl shadow-2xl text-center relative z-10">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 mb-6">
              <AlertTriangle className="w-7 h-7 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold font-['Space_Grotesk'] mb-3">
              Something went wrong
            </h1>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              An unexpected error occurred. The portfolio CMS has caught this error to prevent the app from fully crashing.
            </p>

            {this.state.error && (
              <pre className="text-left text-xs bg-black/40 border border-white/5 rounded-lg p-4 text-red-400 overflow-auto max-h-32 mb-6 font-mono">
                {this.state.error.message}
              </pre>
            )}

            <button
              onClick={this.handleReset}
              className="w-full py-3 px-6 bg-accent-cyan text-charcoal-950 font-bold rounded-xl hover:bg-accent-cyan/90 active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 text-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Go to Home Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
