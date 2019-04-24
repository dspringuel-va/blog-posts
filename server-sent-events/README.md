# Server-Sent Events

This post is about Server-Sent Events, a web standard to allow a server to send many responses to the browser.

## Context
When working on web applications, there are many UX problems that could be alleviated if the server would notify the client about events as they arrive.
In Customer Voice for example, it would be nice to have a progress bar to show how many customers are being saved when the user upload a big list of customers,
or to update a review request status as it happens (e.g. from opened to clicked) without refreshing the page.

Websocket is always the first thing that comes to my mind when I think of technology to have server push notifications.
However, it seems overkill for that specific purpose. For example, I wouldn't need full-duplex communication to solve the problems mentioned above.

I was doing research on the subject when I stumbled upon this StackOverflow answer (please scroll to the "Update" section): https://stackoverflow.com/a/14711517.
It lists many web protocols.
Amongst them is "HTTP streaming", standardized by the name "Server-Sent Events".
The author of the answer describes it as
> a variety of techniques (multipart/chunked response) that allow the server to send more than one response to a single client request.

Server-Sent Events sounds like exactly like the kind of technology I was looking for.
This post is an high-level overview of this standard.

## What is it?

Server-Sent Events is a standard that allows the server to send multiple responses to a client (most likely the browser) in a single long-lived connection.
This standard is defined as a normal HTTP request.
If a server can handle HTTP request, it can certainly handle Server-Sent Events.

### Server Side
The gist of this standard is about formatting correctly the responses sent back to the client and setting a few headers on the server.

The crucial part of the standard on the server side is the response formatting. Every event must have the following part to be accepted by the client:

```
data: {message} \n\n
```

The response must be prefix by `data: `, followed by the message in text format. When the event is done, two new line characters are added at the end of the response, i.e. `\n\n`.
One newline is also accepted, but only for every line except the last one.
The last line must have exactly two new line characters.
For example,

```
data: This is the first line \n
data: Continued on a second line \n
data: All done \n\n
```

The standard also defines other prefix: `event`, `id`, and `retry`.
The `event` prefix allows to 'type' the event sent. For example,

```
event: create\n
data: AG-123\n\n

event: create\n
data: AG-456 \n\n

event: delete\n
data: AG-123\n\n
```

This would send three events; two of type `create` and one of type `delete`. This allows the client to handle the events differently (more details in the client example).
If the server doesn't specify any type, it will be `message` by default.

The `retry` prefix is used to tell how long the client the client should wait (in milliseconds) before attempting to reconnect if the connection closes unexpectedly.

```
retry: 10000\n
data: Hello\n\n
```

If none is specified, it defaults to 3 seconds.

Furthermore, the server must also set the `'Content-Type': 'text/event-stream'` header before starting to send the responses.
From this header, we conclude that the responses sent back to the client are in a text format (no binary).

### Client Side
On the client side, there is an API defined to use this standard: `EventSource`.
The client can open the connection by creating that object.

```ts
const source: EventSource = new EventSource(url);
```

Then, the client sets up listeners to various event types.

```ts
source.addEventListener('message', function(e: MessageEvent) {
  // On message
});

source.addEventListener('open', function(e: Event) {
  // Connection was opened.
});

source.addEventListener('error', function(e: Event) {
  if (e.readyState == EventSource.CLOSED) {
    // Connection was closed.
  }
  else {
    // Any other error.
  }
});
```

To close the connection, the client can call the `close()` method on the `EventSource` object.

## Server Example

Here is an example of a Node.js server (using Express), implementing an Server-Sent Event endpoint `/stream`.

```ts
app.get('/stream', (request: Request, response: Response) => {
  console.log(`Client opened the connection.`);
  response.header("Content-Type", "text/event-stream");
  response.header("Connection", "keep-alive");

  response.write('event: hello\n');
  response.write('data: Hello World!\n\n');

  let i = 1;
  const stream = () => {
    response.write(`id: ${i}\n`);
    if (i > 10) {
      response.write(`event: streamEnd\n`);
      response.write(`data: Stream ended\n\n`);
    }

    response.write(`data: Stream ${i}\n\n`)
    i += 1;
    setTimeout(stream, 500);
  }
  stream();

  request.on('close', () => {
    console.log(`Client closed the connection.\n`);
  })
});
```

It start by setting the headers `Content-Type` and `Connection`.
Then, it sends an 'Hello' event of type `hello`. After it sends a sequence of 10 messages, followed by a 'Stream ended message' of type `streamEnded`.
Furthermore, it add a listener to a close event on the request. This fires when the connection closes.

## Client Example
Here is a example of an Angular component using the `EventSource` interface.

```ts
export class AppComponent implements OnInit {
  title = 'stream-client';
  events: string[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log('On init');
    const stream: EventSource = new EventSource('http://localhost:13000/stream');

    stream.addEventListener('message', (message: MessageEvent) => {
      this.events.push(message.data);
      console.log(message);
    });

    stream.addEventListener('streamEnd', (message: MessageEvent) => {
      this.events.push(`${message.data} (it was the last one)`);
      stream.close();
    });

    stream.addEventListener('hello', (message: MessageEvent) => {
      this.events.push(`Hello Message => ${message.data}`);
    });

    stream.addEventListener('open', (open: Event) => {
      console.log(open);
    });

    stream.addEventListener('error', (error: Event) => {
      console.log(error);
    });
  }
}
```

The client opens the connection to `http://localhost:13000/stream` (which is the port the server listens to).
Then, it add listeners for events of type `message` (which is the default), `streamEnd` and `hello`.
When it receives the `streamEnd` event, it close the connection.
The client also listens for when the connections opens, and when there are errors.

### In action!
Here's a screenshot of the result, from the Network tab:

![In Action](https://i.imgur.com/qxd9icw.gif)

![Server-Sent Events ](https://i.imgur.com/FFqBd0i.png)

## References

### Examples
* https://github.com/dspringuel-va/stream-client
* https://github.com/dspringuel-va/stream-server


### Documentation
* https://www.w3.org/TR/eventsource/
* https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events
* https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
* https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
* https://en.wikipedia.org/wiki/Server-sent_events
* https://www.html5rocks.com/en/tutorials/eventsource/basics/
* https://stackoverflow.com/questions/14703627/websockets-protocol-vs-http