import Footer from "../../components/footer/Footer";
import SearchBar from "../../components/search_bar/SearchBar";
import { SearchIcon } from "../../icons/Icons";

export default function Home() {
	return (
		<div className="text-white w-full h-full flex flex-col">
			<div className="w-full flex-grow flex flex-col items-center justify-center text-white">
				<div className="w-2/4">
					<h1 className="text-9xl flex flex-row items-center gap-[1rem] mb-8">EduSearch <SearchIcon stroke="white" className="w-24 h-24"/></h1>
					<SearchBar defaultQuery="" />
				</div>
				<h1 className="text-lg mt-[2rem]">A Search Engine for Students... by Students</h1>
			</div>
			<Footer />
		</div>
	);
}
