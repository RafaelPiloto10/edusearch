import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import { Navbar } from "../../components/navbar/Navbar";

interface Result {
	title: string;
	blurb: string;
	url: string;
}

function SearchResult(props: Result) {
	return (
		<div className="text-white">
			<div onClick={() => window.location.replace(props.url)} className="hover:cursor-pointer">
				<h1 className="text-xl text-blue-500 hover:underline">{props.title}</h1>
				<p className="text-sm text-gray-500">{props.url}</p>
			</div>
			<p className="text-sm">{props.blurb}</p>
		</div>
	);
}

export default function SearchQuery() {
	const [searchParams, _] = useSearchParams();
	const [results, setResults] = useState<Result[]>([]);
	const query = searchParams.get("q") || "";

	useEffect(() => {
		const getResults = async () => {
			return new Promise<Result[]>(async (resolve, reject) => {
				const result = await fetch("http://localhost:8000/search", {
					method: "POST",
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({
						query: query,
						rankType: "pageRank"
					})
				}).then(r => r.json()).then(r => {
					const results: any[] = r.results;
					const pageResults: Result[] = [];
					if (r.results) {
						for (const result of results) {
							const content = result.content.split("\n");
							console.log(content);
							pageResults.push({
								url: content[0],
								title: content[1],
								blurb: content[2],
							});
						}
					}
					resolve(pageResults);
				});
			});
		};

		getResults().then((r) => {
			setResults(r)
		});
	}, [query]);

	return (
		<div className="w-full h-full flex flex-col">
			<Navbar defaultQuery={query} />

			<div className="flex-grow flex justify-center mt-2">
				<div className="flex flex-col w-11/12 bg-zinc-800 p-8 rounded-lg gap-[2rem]">
					{results.map((_result, i) => <SearchResult {..._result} key={i} />)}
				</div>
			</div>
			<Footer />
		</div>
	);
}
