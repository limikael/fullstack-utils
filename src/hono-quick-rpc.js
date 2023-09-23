import {HTTPException} from "hono/http-exception";

export function quickRpc(cls) {
	return async (c, next)=>{
		let body=await c.req.raw.json();
		let instance=new cls(c);

		if (!instance[body.method])
			throw new HTTPException(404,{message: "Not found"});

		let result=await instance[body.method](...body.params);
		if (result===undefined)
			result=null;

		return Response.json({result: result});
	}
}