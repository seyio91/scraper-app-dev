const EventEmitter = require('eventemitter3');
const emitter = new EventEmitter();


function publish(eventData){
    emitter.emit('event', eventData);
}

function subscribe(req, res){
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
    })

    const nln = function(){
        res.write('\n');
    }

    const hbt = setInterval(nln, 15000);

    const onEvent = function(data){
        res.write('retry: 500\n')
        res.write(`event: event\n`)
        res.write(`data: ${data}\n\n`)
        console.log('Subscribe Triggered')
    }

    emitter.on('event', onEvent)

    req.on('close', function(){
        clearInterval(hbt);
        emitter.removeListener('event', onEvent);
    })
}

module.exports = {
    subscribe,
    publish
}