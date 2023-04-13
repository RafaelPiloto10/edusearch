import { useNavigate } from "react-router-dom";
import { SearchIcon } from "../../icons/Icons";
import SearchBar from "../search_bar/SearchBar";

export function Navbar(props: { defaultQuery: string }) {
	const navigate = useNavigate();

	return (
		<div className="w-full flex flex-row items-center p-8">
			<div className="flex flex-row items-center hover:cursor-pointer" onClick={() => navigate("/")}>
				<div className="">
					<p className="text-xl text-white font-bold">EduSearch</p>
				</div>
				<div className="flex flex-row ml-2">
					<SearchIcon stroke="white" className="w-8 h-8" />
				</div>
			</div>

			<div className="w-full flex flex-row items-center justify-center">
				<div className="w-2/3">
					<SearchBar defaultQuery={props.defaultQuery} />
				</div>
			</div>
		</div>
	);
}
