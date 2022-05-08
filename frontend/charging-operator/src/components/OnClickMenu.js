import { Link } from 'react-router-dom';
import { useState } from 'react';

const OnClickMenu = () => {
    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const openMenu = () => {
        if (!menuIsOpen) setMenuIsOpen(true);
        else setMenuIsOpen(false);
    }

    return (
        <div onClick={openMenu} className={ menuIsOpen ? "three-lines-x" : "three-lines" }>
            <div className={ menuIsOpen ? "three-lines-menu" : "no-display"}>
                <ul>
                    <li>
                        <Link to="/app/settings">Settings</Link>
                    </li>
                    <li>
                        <Link to="/app/statistics">Statistics</Link>
                    </li>
                    <li>
                        <Link to="/logout">Logout</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
 
export default OnClickMenu;
