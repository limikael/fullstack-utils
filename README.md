# fullstack-utils
Assorted collection of middlewares, hooks and components

## hono-cloudflare-content
```
import {serveStatic} from "fullstack-utils/hono-cloudflare-content";

// ...

app.use(serveStatic())
```
(Hono)[https://hono.dev/] middleware for serving static content.
