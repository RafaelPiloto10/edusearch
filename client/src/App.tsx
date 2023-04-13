import {
	createBrowserRouter,
	Outlet,
	RouterProvider,
} from "react-router-dom";

import Home from "./pages/home/Home";
import SearchQuery from "./pages/search_query/SearchQuery";

export default function App() {
	const router = createBrowserRouter([
		{
			path: "/search",
			element: <SearchQuery />,
		},
		{
			path: "/",
			element: <Home />,
		},
	]);


	return (
		<div className="w-screen h-screen bg-zinc-900">
			<div className="max-w-[1440px] w-full h-full mt-0 mb-auto mr-auto ml-auto">
				<RouterProvider router={router} />
			</div>
		</div>
	);
}
