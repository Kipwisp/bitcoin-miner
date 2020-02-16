// telling the worker to activate every 50 milliseconds
function update() {
    postMessage('');
}

setInterval(update, 50);