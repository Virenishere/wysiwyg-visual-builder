export default function GlobalLoader({ message, subtext, fullScreen = true }) {
  return (
    <div
      className={`w-full ${
        fullScreen ? 'min-h-screen' : ''
      } flex flex-col items-center justify-center text-center`}
    >
      <div className="loadingspinner scale-75 md:scale-100">
        <div id="square1"></div>
        <div id="square2"></div>
        <div id="square3"></div>
        <div id="square4"></div>
        <div id="square5"></div>
      </div>
      {message && (
        <p className="text-lg font-medium text-gray-700 animate-pulse mt-6">
          {message}
        </p>
      )}
      {subtext && <p className="text-sm text-gray-500 mt-2">{subtext}</p>}
    </div>
  );
}
