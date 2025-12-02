const ErrorState = ({ error, onRetry }) => {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
      <p className="text-red-700">{error}</p>

      <button
        onClick={onRetry}
        className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200"
      >
        Try Again
      </button>
    </div>
  );
};

export default ErrorState;
