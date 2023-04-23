import { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function SearchBar(props: { defaultQuery: string }) {
	const [searchQuery, setSearchQuery] = useState(props.defaultQuery);
	const [searchParams, _] = useSearchParams();
	const algo = searchParams.get("algo") || "pageRank";


	return (
		<div className="w-full flex flex-row items-center justify-center gap-2">
			<div className="flex-grow flex items-center justify-center">
				<div className="w-2/3">
					<input type="text"
						className="bg-zing-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-0 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
						placeholder="Search"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						onKeyUp={(e) => {
							if (e.key === "Enter") {
								const url = `/search?q=${encodeURI(searchQuery)}&algo=${algo}`;
								if (searchQuery !== "") {
									window.location.replace(url);
								}
							}
						}}
					/>
				</div>
			</div>

			<div className="flex flex-col">
				<label className="block mb-2 text-sm font-medium text-white-900 dark:text-white">Select an Algorithm</label>
				<select onChange={(e) => {
					const url = `/search?q=${encodeURI(searchQuery)}&algo=${e.target.value}`;
					window.location.replace(url);
				}}
					id="countries"
					value={algo}
					className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
					<option selected value="pageRank">Pagerank</option>
					<option value="hits">Hits</option>
					<option value="simRank">SimRank</option>
				</select>
			</div>

		</div>
	);
}
