export function httpsRedirect(options={}) {
	if (!options.ignore)
		options.ignore=["localhost"];

	return async (c, next)=>{
		let u=new URL(c.req.raw.url);

		if (!options.ignore.includes(u.hostname) &&
				u.protocol=="http:") {
			u.protocol="https:";

			let headers=new Headers();
			headers.set("location",u);
			return new Response("Moved",{
				status: 301,
				headers: headers
			});
		}

		await next();
	}
}