import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const assetManifest = JSON.parse(manifestJSON);

let mimeTypes={
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".js": "text/javascript",
	".css": "text/css",
	".svg": "image/svg+xml",
	".webp": "image/webp"
};

export default class CloudflareContent {
	requestHandler=async (c, next)=>{
		let assetName=new URL(c.req.url).pathname.slice(1);
		if (!assetManifest[assetName])
			return await next();

		let mimeType;
		for (let k in mimeTypes)
			if (assetName.endsWith(k))
				mimeType=mimeTypes[k];

		let etag='W/"'+assetManifest[assetName]+'"';

		let headers={
			"content-type": mimeType,
			"etag": etag
		}

		//console.log("name: "+assetName+" etag: "+etag+" if: "+c.req.raw.headers.get("if-none-match"));
		if (c.req.raw.headers.get("if-none-match")==etag)
			return new Response(null,{status: 304,headers: headers});

		let asset=await c.env.__STATIC_CONTENT.get(assetManifest[assetName],{type: "stream"});

		return new Response(asset,{headers: headers});
	}
}

export function serveStatic(options={}) {
	let cloudflareContent=new CloudflareContent();

	return async (c, next)=>{
		return await cloudflareContent.requestHandler(c,next);
	}
}