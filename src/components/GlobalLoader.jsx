export default function GlobalLoader() {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="loadingspinner scale-75 md:scale-100">
        <div id="square1"></div>
        <div id="square2"></div>
        <div id="square3"></div>
        <div id="square4"></div>
        <div id="square5"></div>
      </div>
    </div>
  );
}
