export const checkIfImage = (url, callback) => {
    const img = new Image(); //Creates a new image object (in memory, not visible in the UI).
    img.src = url;
  
    if (img.complete) callback(true); //If the image is cached by the browser and already loaded, img.complete will be true.
  
    img.onload = () => callback(true); //If the image loads successfully, the onload event triggers the callback with true.
    img.onerror = () => callback(false); //If the image fails to load (e.g., invalid URL), the onerror event triggers the callback with false.
  };