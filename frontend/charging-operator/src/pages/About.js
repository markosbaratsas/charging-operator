import useTitle from '../hooks/useTitle';
import useWindowDimensions from '../hooks/useWindowDimensions';


const About = ({title}) => {
    useTitle({title});
    const { width } = useWindowDimensions();

    if (width >= 1000) {
    return (
        <main className="flex-column-center-center">
            <div className="about-page">
                <div className="about-words">
                    <h1>About Charging Operator</h1>
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
    else {
        return (
            <main className="flex-column-center-center">
                <div className="about-page-phone">
                    <div className="about-image-phone"></div>
                    <div className="about-words-phone">
                        <h1>About Charging Operator</h1>
                        <p>
                            Charging operator is an app used by EV Charging Station
                            operators, so that they can easily operate their stations.
                            Despite the fact that it is built to make operators' lives
                            easier, it supports some functionality for EV owners, so that
                            they can reserve their vehicle's charging beforehand.
                            <br />
                            <br />
                            It was built in 2022 as part of
                            <br />
                            <a target="_blank" href="https://www.linkedin.com/in/markos-baratsas/">Markos Baratsas</a>' Master Thesis.
                        </p>
                    </div>
                </div>
            </main>
        );
    }
}
 
export default About;
