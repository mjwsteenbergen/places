import React, { ErrorInfo, ReactNode } from "react";

export class ErrorBoundary extends React.Component<{ children: ReactNode}, {
    hasError: boolean,
    error: any,
}> {
    constructor(props: any) {
        super(props);
        this.state = { hasError: false, error: undefined };
    }

    static getDerivedStateFromError(error: any) {
        // Update state so the next render will show the fallback UI.
        return { hasError: true, error: error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        this.setState({
            error: {
                error,
                errorInfo
            }
        })
        // You can also log the error to an error reporting service
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return <>
                <h1>Something went wrong.</h1>
                <pre>{JSON.stringify(this.state, undefined, "\t")}</pre>
            </>;
        }

        return this.props.children;
    }
}