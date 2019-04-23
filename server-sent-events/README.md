# Server-Sent Events

This post is about Server-Sent Events, a web standard to allow a server to send many response to the browser.

## Context
When working on web applications, there are many UX problems that could be alleviated if the server would notify the client about events as they arrive.
In Customer Voice for example, it would be nice to have a progress bar to show which customers are saved when the user upload a big list of customers,
or to update a review request status as it happens (e.g. from opened to clicked) without refreshing the page.

Websocket is always the first thing that comes into my mind when I think of technology to have server notifications.
However, it seems overkill for that specific purpose. For example, I wouldn't need full-duplex communication to solve what I would like to solve.

I was doing research on the subject when I stumbled upon this StackOverflow answer (please scroll to the "Update" section): https://stackoverflow.com/a/14711517.
It lists many web protocols.
Amongst them is "HTTP streaming", standardized by the name "Server-Sent Events".
The author of the answer describes it as
> a variety of techniques (multipart/chunked response) that allow the server to send more than one response to a single client request.

Server-Sent Events sounds like exactly like the kind of technology I was looking for.
This post is an high-level overview of this standard.

## What is it?



## Server Example

## Client Example

## References

* https://www.w3.org/TR/eventsource/
* https://html.spec.whatwg.org/multipage/server-sent-events.html#server-sent-events
* https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events
* https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events
* https://en.wikipedia.org/wiki/Server-sent_events
* https://www.html5rocks.com/en/tutorials/eventsource/basics/
* https://stackoverflow.com/questions/14703627/websockets-protocol-vs-http