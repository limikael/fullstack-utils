# fullstack-utils
Assorted collection of middlewares, hooks and components

## hono-cloudflare-content
```javascript
import {serveStatic} from "fullstack-utils/hono-cloudflare-content";

// ...

app.use(serveStatic())
```
[Hono](https://hono.dev/) middleware for serving static content.

## hono-https-redirect

```javascript
import {httpsRedirect} from "fullstack-utils/hono-https-redirect";

// ...

app.use(httpsRedirect())
```
[Hono](https://hono.dev/) middleware for redirecting all requests to HTTPS.

### httpRedirect(options)
* __options__:
  * __ignore__ - Array of hostnames to ignore and not perform redirect. Default `["localhost"]`.
