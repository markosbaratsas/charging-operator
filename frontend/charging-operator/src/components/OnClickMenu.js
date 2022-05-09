import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import AuthProvider from '../context/AuthProvider';
import { getStationsRequests } from '../api/BackendCalls';

const OnClickMenu = () => {
    const { getAuth } = AuthProvider();

    const [menuIsOpen, setMenuIsOpen] = useState(false);
    const [requests, setRequests] = useState(false);

    useEffect(async () => {
        const data = await getStationsRequests(getAuth());

        if (data !== null && data.length > 0) {
            setRequests(true);
        }
    }, [])

    const openMenu = () => {
        if (!menuIsOpen) setMenuIsOpen(true);
        else setMenuIsOpen(false);
    }

    return (
        <div onClick={openMenu} className={ menuIsOpen ? "three-lines-x" : (
                                            !requests  ? "three-lines" :
                                            "three-lines three-lines-notification")}>
            <div className={ menuIsOpen ? "three-lines-menu" : "no-display"}>
                <ul>
                    {requests ? (
                        <li>
                            <Link className='notif-settings' to="/app/settings">Settings</Link>
                        </li>
                    ) : (
                        <li>
                            <Link to="/app/settings">Settings</Link>
                        </li>
                    )}
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
