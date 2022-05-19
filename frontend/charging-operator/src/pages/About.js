import useTitle from '../hooks/useTitle';


const About = ({title}) => {
    useTitle({title});

    return (
        <main className="flex-column-center-center">
            <div className="about-page">
                <div className="about-words">
                    <h1>About Charging operator</h1>
                    <p>
                        Charging operator is an app used by EV Charging Station <br />
                        operators, so that they can easily operate their stations. <br />
                        Despite the fact that it is built to make operators' lives <br />
                        easier, it supports some functionality for EV owners, so that <br />
                        they can reserve their vehicle's charging beforehand. <br />
                        <br />
                        It was built in 2022 as part of <a target="_blank" href="https://www.linkedin.com/in/markos-baratsas/">Markos Baratsas</a>' Master Thesis.
                    </p>
                </div>
                <div className="about-image"></div>
            </div>
        </main>
    );
}
 
export default About;
