import { SVGProps } from "react";

export function SearchIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
	const defaultProps = {fill:"none", viewBox:"0 0 24 24", strokeWidth:"1.5", stroke: "currentColor", className: "w-6 h-6"};
	return (
		<svg {...{...defaultProps, ...props}} xmlns="http://www.w3.org/2000/svg">
			<path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
		</svg>
	);
}
