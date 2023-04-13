import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SearchBar(props: {defaultQuery: string}) {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState(props.defaultQuery);

	return (
		<div className="w-full">
			<input type="text"
				className="bg-zing-50 border border-zinc-300 text-zinc-900 text-sm rounded-lg focus:ring-blue-500 focus:outline-0 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-700 dark:border-zinc-600 dark:placeholder-zinc-400 dark:text-white focus:ring-blue-500 focus:border-blue-500"
				placeholder="Search"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
				onKeyUp={(e) => {
					if (e.key === "Enter") {
						const url = `/search?q=${encodeURI(searchQuery)}`;
						if (searchQuery !== "") {
							navigate(url);
						}
					}
				}}
			/>
		</div>
	);
}
