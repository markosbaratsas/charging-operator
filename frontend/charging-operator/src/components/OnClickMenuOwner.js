import { Link } from 'react-router-dom';
import { useState } from 'react';


const OnClickMenuOwner = () => {
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
                        <Link to="/logout">Logout</Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}

export default OnClickMenuOwner;
