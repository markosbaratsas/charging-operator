import useTitle from '../hooks/useTitle';


const Contact = ({title}) => {
    useTitle({title});

    return (
        <h1>Contact</h1>
    );
}
 
export default Contact;
