import {HTTPException} from "hono/http-exception";

export function quickRpc(cls) {
	return async (c, next)=>{
		let body=await c.req.raw.json();

		//console.log("received call for: "+body.method);
		let instance;
		try {
			if (typeof cls=="function" && !cls.prototype)
				instance=await cls(c);

			else
				instance=new cls(c);
		}

		catch (e) {
			console.log("unable to create api instance...");
			console.log(e);
			throw e;
		}

		//console.log("instance created...");

		if (!instance[body.method])
			throw new HTTPException(404,{message: "Not found: "+body.method});

		try {
			let result=await instance[body.method](...body.params);
			if (result===undefined)
				result=null;

			return Response.json({result: result});
		}

		catch (e) {
			console.error(e);
			return new Response(e.message,{
				status: 500
			});
		}
	}
}