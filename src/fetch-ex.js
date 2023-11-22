import urlJoin from "url-join";

function isPlainObject(value) {
	if (typeof value!=='object' || value===null)
		return false;

	return Object.getPrototypeOf(value)===Object.getPrototypeOf({})
}

async function baseFetchEx(url, options={}) {
	if (!(options.headers instanceof Headers))
		options.headers=new Headers(options.headers);

	if (isPlainObject(options.body)) {
		switch (options.headers.get("content-type")) {
			case "application/json":
				options.body=JSON.stringify(options.body);
				break;

			default:
				throw new Error("Don't know how to serialize body into: "+options.headers.get("content-type"));
				break;
		}
	}

	if (options.baseUrl)
		url=urlJoin(options.baseUrl,url);

	if (options.query) {
		url=new URL(url);
		url.search=new URLSearchParams(options.query).toString();
	}

	let result=await fetch(url,options);
	if (result.status<200 || result.status>=300)
		throw new Error(await result.text());

	switch (options.dataType) {
		case "json":
			result.data=await result.json();
			break;

		case "text":
			result.data=await result.text();
			break;

		case "extractJson":
			return await result.json();
			break;

		case "extractText":
			return await result.text();
			break;
	}

	return result;
}

function configureFetchEx(baseOptions={}) {
	function fetchEx(url, options={}) {
		return baseFetchEx(url,{...baseOptions, ...options});
	}

	fetchEx.post=(url, options={})=>{
		let o={...baseOptions, ...options, method: "POST"};
		return baseFetchEx(url,o);
	}

	fetchEx.get=(url, options={})=>{
		let o={...baseOptions, ...options, method: "GET"};
		return baseFetchEx(url,o);
	}

	fetchEx.delete=(url, options={})=>{
		let o={...baseOptions, ...options, method: "DELETE"};
		return baseFetchEx(url,o);
	}

	fetchEx.configure=(options={})=>{
		return configureFetchEx({...baseOptions,...options});
	}

	return fetchEx;
}

const fetchEx=configureFetchEx(baseFetchEx);

export default fetchEx;

//await fetchEx.configure({dataType: "text", baseUrl: "http://localhost:8000"}).post("/hello");