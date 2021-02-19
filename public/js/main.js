// uncomment line below to register offline cache service worker
// navigator.serviceWorker.register('../serviceworker.js');

if (typeof fin !== 'undefined') {
    init();
} else {
    document.querySelector('#of-version').innerText =
        'The fin API is not available - you are probably running in a browser.';
}

// once the DOM has loaded and the OpenFin API is ready
async function init() {
    // get a reference to the current Application.
    const app = await fin.Application.getCurrent();
    const win = await fin.Window.getCurrent();

    const ofVersion = document.querySelector('#of-version');
    ofVersion.innerText = await fin.System.getVersion();


    // only launch new windows from the main window.
    if (win.identity.name === app.identity.uuid) {

        const settings = {
            url: location.href.replace('index', 'input'),
            name: `child-${new Date(Date.now()).toTimeString().slice(0, 8)}`,
            defaultWidth: 500,
            defaultHeight: 500,
            autoShow: false
        };
        const child = new fin.desktop.Window(settings, () => {
            child.focus();
        });

        // subscribing to the run-requested events will allow us to react to secondary launches, clicking on the icon once the Application is running for example.
        // for this app we will  launch a child window the first the user clicks on the desktop.
        const createWindowBtn = document.querySelector('#create-window');
        createWindowBtn.addEventListener('click', async (e) => {
            e.preventDefault();

            await child.show();
            await child.bringToFront();
            await child.focus();
        })
    }
}
