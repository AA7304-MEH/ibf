import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return (
                <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-red-50 p-4 text-red-900">
                    <div className="max-w-2xl w-full bg-white rounded-lg shadow-xl overflow-hidden border border-red-200">
                        <div className="p-6 bg-red-100 border-b border-red-200">
                            <h1 className="text-2xl font-bold text-red-800">Application Error</h1>
                            <p className="mt-2 text-red-700">Something went wrong making the application unable to render.</p>
                        </div>
                        <div className="p-6 overflow-auto max-h-[60vh]">
                            <h3 className="font-semibold text-gray-900 mb-2">Error Details:</h3>
                            <pre className="font-mono text-sm whitespace-pre-wrap text-red-600 bg-red-50 p-4 rounded border border-red-100">
                                {this.state.error?.toString()}
                                {this.state.error?.stack && (
                                    <>
                                        <br />
                                        <br />
                                        {this.state.error.stack}
                                    </>
                                )}
                            </pre>
                        </div>
                        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
                            <button
                                onClick={() => window.location.reload()}
                                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                                Reload Page
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
