import { Link,useLocation } from "react-router-dom";
import { useState,useEffect, memo } from 'react';
import Logo from '../assets/images/logo.png'


function SideBar(props)
{
    const location = useLocation()
    const [url,setUrl] = useState(location.pathname)
    useEffect(() => {
        setUrl(location.pathname);
    })

    function closeNav() {
        var x = window.matchMedia("(max-width: 768px)")
        if (x.matches) { 
        document.getElementById("sidebar").style.width = "0";
        }
        // document.getElementById("sidebar").style.position = "sticky";
    }
    return <>
    <div className="sidebar" id="sidebar">
        <div className="close-nav-section">
        <div className="logo">
            <img src={Logo}/>
        <i class="fa-solid fa-times close-sidebar-icon" onClick={closeNav}></i>
        </div>
        </div>
        <div className="sidebar-scroll">
        <span className="menu-head">MENU</span>
        <ul className="sidebar-ul">
            
            <li className={url == "/" ? "active" :''}>
                <Link to={"/"} onClick={closeNav}><i class="fa-solid fa-house-user"></i><span>Whitelist</span></Link>
            </li>
            <li className={url == "/sale" ? "active" :''}>
                <Link to={"/sale"} onClick={closeNav}><i class="fa-solid fa-house-user"></i><span>Sale</span></Link>
            </li>
            {/* <li className={url == "/burn" ? "active" :''}>
                <Link to={"/burn"} onClick={closeNav}><i class="fa-solid fa-house-user"></i><span>Burn</span></Link>
            </li>
            <li className={url == "/release" ? "active" :''}>
                <Link to={"/release"} onClick={closeNav}><i class="fa-solid fa-house-user"></i><span>Release nft</span></Link>
            </li> */}
            <li className={url == "/add-vote" ? "active" :''}>
                <Link to={"/add-vote"} onClick={closeNav}><i class="fa-solid fa-house-user"></i><span>Add vote</span></Link>
            </li>
            <li className={url == "/list-vote" ? "active" :''}>
                <Link to={"/list-vote"} onClick={closeNav}><i class="fa-solid fa-house-user"></i><span>list vote</span></Link>
            </li>
            <li className={url == "/list-community" ? "active" :''}>
                <Link to={"/list-community"} onClick={closeNav}><i class="fa-solid fa-house-user"></i><span>list community</span></Link>
            </li>
            
        <li className={url == "/vesting" ? "active" : ''}>
                <Link to={"/vesting"} onClick={closeNav}><i className="fa-solid fa-house-user"></i><span>vesting</span></Link>
            </li>
            <li className={url == "/mintable" ? "active" : ''}>
                <Link to={"/mintable"} onClick={closeNav}><i className="fa-solid fa-house-user"></i><span>Mintable</span></Link>
            </li>
            <li className={url == "/text" ? "active" : ''}>
                <Link to={"/text"} onClick={closeNav}><i className="fa-solid fa-house-user"></i><span>Edit Date</span></Link>
            </li>
        </ul>
        </div>
    </div>
</>
}
export default memo(SideBar);