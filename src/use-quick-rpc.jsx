import {createContext, useContext} from "react";

let proxyMethodHandler={
	get: (target,prop,_receiver)=>{
		return async (...params)=>{
			return await target.callMethod(prop,params);
		}
	}
};

class QuickRpc {
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

		return await response.json();
	}
}

let QuickRpcContext=createContext();

export function QuickRpcProvider({fetch, url, children}) {
	let api=new QuickRpc({fetch, url});

	return (<>
		<QuickRpcContext.Provider value={api}>
			{children}
		</QuickRpcContext.Provider>
	</>);
}

export function useQuickRpc() {
	return useContext(QuickRpcContext).proxy;
}
