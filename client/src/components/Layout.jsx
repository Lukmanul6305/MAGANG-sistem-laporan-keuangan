import Navbar from "./Navbar";
import Dashboard from "../pages/Dashboard";
import { useState } from "react";
import Pemasukan from "../pages/Pemasukan";

const Layout = ()=>{
    const [isOpen,setIsOpen] = useState(true)
    const [animate,setAnimate] = useState(false)

    const handleToggle = () =>{
        setAnimate(true)
        setIsOpen(!isOpen)
        setTimeout(()=> setAnimate(false),300)
    }

    return(
        <div className="flex">
            <Navbar 
                isOpen={isOpen}
                handleToggle={handleToggle}
                animate={animate}
            />
            <Dashboard 
            isOpen={isOpen}/>
        </div>
    )
}

export default Layout