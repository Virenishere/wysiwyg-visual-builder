function throttle(func, delay) {
  let timeoutId = null;
  let lastArgs = null;
  let lastThis = null;

  return function (...args) {
    lastArgs = args;
    lastThis = this;

    if (!timeoutId) {
      timeoutId = setTimeout(() => {
        func.apply(lastThis, lastArgs);
        timeoutId = null;
        lastArgs = null;
        lastThis = null;
      }, delay);
    }
  };
}

export default throttle;
