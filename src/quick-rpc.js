let proxyMethodHandler={
	get: (target,prop,_receiver)=>{
		return async (...params)=>{
			return await target.callMethod(prop,params);
		}
	}
};

export class QuickRpc {
	constructor({fetch, url}) {
		this.fetch=fetch;
		this.url=url;
		this.proxy=new Proxy(this,proxyMethodHandler);
	}

	async callMethod(method, params) {
		let response=await this.fetch(this.url,{
			method: "POST",
			headers: new Headers({
				"content-type": "application/json"
			}),
			body: JSON.stringify({
				method: method,
				params: params
			})
		});

		if (response.status<200 || response.status>=300)
			throw new Error(await response.text());

		return (await response.json()).result;
	}
}

export function createQuickRpcProxy(params) {
	let quickRpc=new QuickRpc(params);
	return quickRpc.proxy;
}