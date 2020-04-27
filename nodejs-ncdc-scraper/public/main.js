function eventConnection (){
    source = new EventSource('http://localhost:3000/stream');

    source.onopen = function(e){
        console.log('connection made');
    }

    source.onmessage = function(e){
        console.log(e.data)
    }

    source.onerror = function(e){
        console.log(e)
    }
}

if (windows.EventSource){
    eventConnection()
} else {
    console.log('refresh page every minute to get updates')
}