import { useEffect } from 'react';
import { useAlert } from 'react-alert';

import useTitle from '../hooks/useTitle';
import useWindowDimensions from '../hooks/useWindowDimensions';

const PricingMethod = ({title}) => {
    useTitle({title});
    const { width } = useWindowDimensions();
    const alert = useAlert();

    useEffect(() => {
        if (width < 1000) {
            window.scrollTo(0, 0);
            alert.success('The main application is created only for desktops.');
        }
    }, [])

    return (
        <main className="flex-column-center-center pricing-methods-page">
            <section className="pricing-methods-landing">
                <h1>Which pricing method is best for me?</h1>
            </section>
                <section className="flex-column-center-center pricing-methods-section1">
                    <div className="wrapper flex-column-center-center">
                        <h2>First of all... What is a pricing method?</h2>
                        <p>Charging Operator allows you to set a pricing method for each one 
                        of your stations' Charger Groups. After organizing your
                        chargers in Charger Groups (often called Pricing Groups),
                        you should choose a pricing method for each Pricing Group.</p>
                        
                        <p>A pricing method indicates the way EV owners will be charged while
                        using your station's chargers.</p>

                        <p>Obviously, different operators have different motives when setting
                        a price per KWh for the EVs visiting their stations. For example,
                        some operators might want to focus on earning a fixed profit per KWh
                        despite the changes in electricity cost during the day. These operators
                        should probably use the Fixed Profit pricing method, in order to easily
                        achieve their goal.</p>

                        <p>On the page below, there is a description for each one of the 4 pricing methods
                            that Charging Operator offers.
                        </p>

                    </div>
                </section>

                <section className="flex-column-center-center pricing-methods-section2">
                    <div className="wrapper flex-column-center-center">
                        <h2>Pricing Method 1: Fixed Price</h2>
                        <p style={{paddingBottom: "30px", width: "650px"}}>
                            This is the most simple method that an operator can use. The operator sets
                            a constant price, which will be the price per KWh offered to the EVs. <br/>
                            So, the function used to calculate the price per KWh is the following:
                        </p>

                        <img src="/img/pricing_methods/fixed-price-method.png" alt="Fixed Price Pricing Method" />
                                                
                        <p style={{paddingBottom: "50px", paddingTop: "20px", fontStyle: "italic"}}>where c is a constant defined by the operator.</p>
                    </div>

                    <hr />
                    
                    <div className="wrapper flex-column-center-center">
                        <h2>Pricing Method 2: Fixed Profit</h2>
                        <p style={{paddingBottom: "30px"}}>
                            This method is really useful when operators want to focus on earning
                            a fixed profit per KWh despite the changes in electricity cost during
                            the day. Apart from the cost of electricity, the operators can also set
                            another constant that could represent other expenses that they
                            want to add when charging EVs. <br/>
                            So, the function used to calculate the price per KWh is the following:
                        </p>

                        <img src="/img/pricing_methods/fixed-profit-method.png" alt="Fixed Profit Pricing Method" />
                                                
                        <p style={{paddingBottom: "50px", paddingTop: "20px", fontStyle: "italic"}}>where: <br />
                            - all_expenses represent (optionally) the grid price plus any
                            other (optional) expenses <br />
                            - c is a constant representing the fixed profit that the operator
                            would like to earn from each KWh</p>

                        <h4>It's important to mention that the Charging Operator system
                            is responsible for retrieving and displaying the Grid Price, so that
                            the operators could automatically earn the fixed profit they desire.</h4>
                    </div>

                    <hr />
                    
                    <div className="wrapper flex-column-center-center">
                        <h2>Pricing Method 3: Demand-centered Profit</h2>
                        <p style={{paddingBottom: "30px"}}>
                            It is really common when demand for a product appears that the price will
                            rise. This method could be used so that the operators increase their profit
                            in peak hours when demand for charging is increased. Some advantages of this
                            pricing strategy are the following: <br /><br />
                            - Incentivize EV owners to come to your station when the station is
                            relatively empty.  If the station starts reaching its full capacity,
                            increase the price per KWh offered to the EV owners.<br />
                            - Increase profits, since the pricing is dynamically produced based
                            on the demand of the station at a specific time.<br /><br />
                            
                            This method takes also into account the grid price, so that the price
                            per KWh is fixed appropriately, when Grid Price is changing.<br/>

                            So, the function used to calculate the price per KWh is the following:
                        </p>

                        <img style={{height: "85px"}} src="/img/pricing_methods/demand-centered-method.png" alt="Demand-centered Pricing Method" />
                                                
                        <p style={{paddingBottom: "50px", paddingTop: "20px", fontStyle: "italic"}}>
                            where: <br/>
                            - all_expenses represent (optionally) the grid price plus any
                            other (optional) expenses<br/>
                            - c1 is a constant representing the minimum profit that the operator
                            would like to earn from each KWh<br/>
                            -c2 is a constant that the operator sets to define (along with the
                            fraction) the maximum price per KWh<br/>
                            - occupied is the number of occupied chargers of this Charging Group
                            (calculated automatically)<br/>
                            - all_parking is the number of all the chargers that this Charging Group has
                            (calculated automatically)<br/>
                        </p>

                        
                        <h4>It's important to mention that the Charging Operator system
                            is responsible for retrieving and displaying the Grid Price, so that
                            the operators could automatically earn the fixed profit they desire.
                            The same applies for the occupied and all_parking variables,
                            that automatically change when there are more vehicle charging on the station.</h4>
                    </div>

                    <hr />
                    
                    <div className="wrapper flex-column-center-center">
                        <h2>Pricing Method 4: Competitor centered profit</h2>
                        <p style={{paddingBottom: "30px"}}>
                            It is really common for operators to set their charging prices based on
                            what other competitors are charging. So, why not automate this procedure? <br/>
                            The competitor centered profit method allows operators to
                            easily choose competitors on the map and provide a price per KWh
                            based on what other competitors charge.
                            In addition to this, the operators can set a minimum price per KWh,
                            so that they never charge in very low prices (despite what the competitors are doing).<br/>

                            So, the function used to calculate the price per KWh is the following:
                        </p>

                        <img style={{height: "85px"}} src="/img/pricing_methods/competitor-centered-profit-method.png" alt="Competitor-centered Pricing Method" />
                                                
                        <p style={{paddingBottom: "50px", paddingTop: "20px", fontStyle: "italic"}}>
                            where: <br/>
                            - all_expenses represent (optionally) the grid price plus any
                            other (optional) expenses<br/>
                            - c1 is a constant representing the minimum profit that the operator
                            would like to earn from each KWh<br/>
                            - competitors are some the competitor stations that the operator
                            can choose from the map (our system integrates Google Maps, so
                            the whole prosedure is fairly simple). min(competitors) is the minimum
                            price of the minimum prices that these stations offer<br/>
                            -c2 is a constant representing the offset of the price you want to offer,
                            in comparison with the lowest price of the other stations.
                            This constant could be negative.
                        </p>
                    </div>
                </section>
        </main>
    );
}
 
export default PricingMethod;
