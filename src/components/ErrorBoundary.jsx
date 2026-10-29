import React from 'react';
import { AlertTriangle } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-[#2B2C30] text-[#FF1457]">
          <AlertTriangle size={64} className="mb-4 text-[#FF1457]" />
          <h2 className="text-2xl font-bold mb-2">Erro Crítico / Critical Error</h2>
          <p className="text-sm text-gray-400 mb-6">{this.state.error?.message || "Algo deu errado durante a renderização da interface."}</p>
          <button onClick={() => window.location.reload()} className="bg-[#FF1457] hover:opacity-90 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition-colors">
            Reiniciar App / Reload App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
