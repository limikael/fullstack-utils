# fullstack-utils
Assorted collection of Hono middlewares, Preact hooks and various other components and functions that I
saw myself using over and over.

- __[hono-cloudflare-content](#hono-cloudflare-content)__ - Serve static content with ETag support.
- __[hono-https-redirect](#hono-cloudflare-content)__ - Redirect all requests to HTTPS.
- __[hono-quick-rpc](#hono-quick-rpc)__ - Expose JSON-RPC API.
- __[use-quick-rpc](#use-quick-rpc)__ - Client for calling JSON-RPC endpoints.
- __[fetch-ex](#fetch-ex)__ - Wrapper for the fetch call.
- __[use-feather](#use-feather)__ - Spring based animations, similar to react-spring.

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
app.use("*",httpsRedirect({/* ...options... */}))
```
The `httpsRedirect` function accepts a configuration object with the following members:
* __ignore__ - Array of hostnames to ignore and not perform redirect. Default `["localhost"]`.

## hono-quick-rpc
[Hono](https://hono.dev/) middleware for creating an RPC endpoint. The enpoint is for the most part JSON-RPC
compliant, but the main focus is not compliance but convenience in creating APIs for internal
client-server communication in projects. Works like this:

```javascript
import {quickRpc} from "fullstack-utils/hono-quick-rpc";

class Api {
    constructor(context) {
        // context is Hono request context
    }

    function myfunc() {
        // ...
    }
}

// ...assume app is a Hono instance.
app.use("/myapi",quickRpc(Api))
```
Now a JSON-RPC endpoint will exist on `/myapi`. All methods exposed by the class will be made available
as JSON-RPC methods. The positional parameters passed in the JSON-RPC call will be passed to the method,
named parameters are not supported. An instance of the class will be constructed for each request, 
and the request context will be passed to the constructor.

## use-quick-rpc
A React context and hook for calling JSON-RPC endpoints. In order to use it, you need to first provide a
context on a higher level in your component tree:

```javascript
import {QuickRpcProvider} from "fullstack-utils/use-quick-rpc";

function TopLevelComponent({children}) {
    return (
        <QuickRpcProvider url="/myapi" fetch={fetch}>
            {children}
        </QuickRpcProvider>
    );
}
```

Then, you can make calls to the api in further down in your child components:
```javascript
import {useQuickRpc} from "fullstack-utils/use-quick-rpc";

function ChildComponent() {
    let api=useQuickRpc();
    let result=await api.myfunc();
    // ...
}
```

## fetch-ex
A wrapper for the `fetch` call.

## use-feather
A spring based animation tool.

```javascript
import {useFeather} from "fullstack-utils/use-feather";

function MyComponent() {
    let ref=useRef();
    let feather=useFeather(v=>ref.current.style.opacity=`${v}%`);

    feather.setTarget(100);

    return (
        <div ref={ref}>
            fading...
        </div>
    );
}
```