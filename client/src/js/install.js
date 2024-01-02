const butInstall = document.getElementById('buttonInstall');
let deferredPrompt;

// Logic for installing the PWA
// Add an event handler to the `beforeinstallprompt` event
window.addEventListener('beforeinstallprompt', (event) => {
  // prevent default added to prevent the default browser install prompt
  event.preventDefault();
  // store the event for later use
  deferredPrompt = event;
  // display the install button in a block element
  butInstall.style.display = 'block';

  // Log statement to check if the event is triggered
  console.log('Before install prompt event triggered');
});

// TODO: Implement a click event handler on the `butInstall` element
butInstall.addEventListener('click', async () => {
  // checking if the deferred prompt is available
  if (deferredPrompt) {
    // showing the install prompt
    deferredPrompt.prompt();
    // waiting for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    // setting the deferred prompt to null
    deferredPrompt = null;
    // console logging the user choice
    console.log('User choice:', choiceResult.outcome);

    // hiding the install button when the app is installed
    butInstall.style.display = 'none';
  }
});

// TODO: Add an handler for the `appinstalled` event
window.addEventListener('appinstalled', (event) => {
  // console logging the app installed event
  console.log('App installed successfully!', event);
});

//  event listener for fetch errors in the service worker
navigator.serviceWorker.addEventListener('message', (event) => {
  if (event.data.error) {
    // error message for service worker fetch errors
    console.error('Fetch error:', event.data.error);
    document.body.innerHTML = '<h1>Offline</h1>';
  }
});

//  console logs for debugging
console.log('Install.js loaded');
