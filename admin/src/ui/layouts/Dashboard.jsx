import { Outlet } from "react-router-dom";

import Header from "../blocks/Header";
import Footer from "../blocks/Footer";
import SideMenu from '../blocks/SideMenu';

import './Dashboard.css'

export default function Dashboard() {
    
    return (
        <div className="dashboard">
            <Header  />
            <SideMenu />
            <main>
                <Outlet />     
            </main>
            <Footer />
        </div>
    );
}