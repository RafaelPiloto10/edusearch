import { SearchIcon } from "../../icons/Icons";

export function Navbar() {
	return (
		<div className="flex flex-row items-center p-8">
			<div>
				<p className="text-xl text-white font-bold">EduSearch</p>
			</div>
			<div className="flex flex-row ml-2">
				<SearchIcon stroke="white" className="w-8 h-8" />
			</div>
		</div>
	);
}
