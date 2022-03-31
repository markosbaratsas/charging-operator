import useTitle from '../hooks/useTitle';


const About = ({title}) => {
    useTitle({title});

    return (
        <h1>About</h1>
    );
}
 
export default About;
