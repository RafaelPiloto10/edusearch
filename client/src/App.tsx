import {
	createBrowserRouter,
	RouterProvider,
} from "react-router-dom";

import Home from "./pages/home/Home";

export default function App() {
	const router = createBrowserRouter([
		{
			path: "/",
			element: <Home />,
			children: [
				{
					path: "search/:query",
					element: <SearchQuery />,
				}
			],
		},
	]);


	return (
		<div className="w-screen h-screen bg-slate-900">
			<RouterProvider router={router} />
		</div>
	);
}
