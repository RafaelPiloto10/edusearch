export interface IRoute {
    path: string;
    exact: boolean;
    component: any;
    name: string; // Used to update page info and title. 
}

const routes: IRoute[] = [];

export default routes;


