# fullstack-utils
Assorted collection of middlewares, hooks and components

## hono-cloudflare-content
[Hono](https://hono.dev/) middleware for serving static content. Use it like this:
```javascript
import {serveStatic} from "fullstack-utils/hono-cloudflare-content";
// ...assume app is a Hono instance.
app.use("*",serveStatic())
```
The reason why it exists is that it handles ETags differently than Hono's built in middleware.

## hono-https-redirect
[Hono](https://hono.dev/) middleware for redirecting all requests to HTTPS. Works like this:
```javascript
import {httpsRedirect} from "fullstack-utils/hono-https-redirect";
// ...assume app is a Hono instance.
app.use("*",httpsRedirect())
```
### httpRedirect(options)
* __options__:
  * __ignore__ - Array of hostnames to ignore and not perform redirect. Default `["localhost"]`.

## hono-quick-rpc
[Hono](https://hono.dev/) for creating an RPC endpoint. The enpoint is for the most part JSON-RPC
compliant. Works like this:

```javascript
import {quickRpc} from "fullstack-utils/hono-quick-rpc";

class Api {
    function myfunc() {
        // ...
    }
}

// ...assume app is a Hono instance.
app.use("/myapi",quickRpc(Api))
```
