import React, { useState } from "react";
import Footer from "../../components/footer/Footer";
import SearchBar from "../../components/search_bar/SearchBar";
import { SearchIcon } from "../../icons/Icons";

export default function Home() {
	const [algo, setalgo] = useState('pageRank')
	return (
		<div className="text-white w-full h-full flex flex-col">
			<div className="w-full flex-grow flex flex-col items-center justify-center text-white">
				<div className="flex flex-col absolute top-10 right-10">
					<label className="block mb-2 text-sm font-medium text-white-900 dark:text-white">Select an Algorithm</label>
					<select onChange={(e) => {setalgo(e.target.value);}} id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-none focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
						<option selected value="pageRank">Pagerank</option>
						<option value="hits">Hits</option>
						<option value="simRank">SimRank</option>
					</select>
				</div>
				<div className="w-2/4">
					<h1 className="text-9xl flex flex-row items-center gap-[1rem] mb-8">EduSearch <SearchIcon stroke="white" className="w-24 h-24" /></h1>
					<SearchBar defaultQuery="" />
				</div>
				<h1 className="text-lg mt-[2rem]">A Search Engine for Students... by Students</h1>
			</div>
			<Footer />
		</div>
	);
}
