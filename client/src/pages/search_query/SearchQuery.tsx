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
	const query = searchParams.get("q") || "";

	const defaultResult = {
		title: "Emory University",
		blurb: "Emory University blah blahblah blahblah blahblah blahblah blahblah blahblah blahblah blahblah blah",
		url: "https://emory.edu"
	};
	const results: Result[] = [defaultResult, defaultResult, defaultResult];

	return (
		<div className="w-full h-full flex flex-col">
			<Navbar defaultQuery={query} />

			<div className="flex-grow flex justify-center mt-2">
				<div className="flex flex-col w-11/12 bg-zinc-800 p-8 rounded-lg gap-[2rem]">
					{results.map((result, i) => <SearchResult {...result} key={i} />)}
				</div>
			</div>
			<Footer />
		</div>
	);
}
