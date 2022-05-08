import ReactLoading from 'react-loading';
import {
    PieChart,
    Pie,
    Cell,
    Legend
 } from 'recharts';
import { colors } from './common';


const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};


const RevenuesPieChart = ({revenues, width, height, station}) => {

    return (
        <div>
            <h3>{station.name}</h3>
            {revenues && revenues.length > 0 ? (
                revenues[0]["value"] + revenues[1]["value"] > 0 ? (
                    <>
                        <PieChart width={width ? width : 400} height={height ? height : 400}>
                            <Pie
                                data={revenues}
                                cx="50%"
                                cy="50%"
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={renderCustomizedLabel}
                                isAnimationActive={false}
                                labelLine={false}
                            >
                                {revenues.map((entry, index) => (
                                    <Cell isAnimationActive={false} key={`cell-${index}`} fill={colors[index % colors.length]} />
                                ))}
                            </Pie>
                            <Legend />
                        </PieChart>
                        <p className="pie-chart-p">{revenues[0].name}:
                            <span style={{color: colors[0]}}>{revenues[0].value.toFixed(2)} €</span>
                        </p>
                        <p className="pie-chart-p">{revenues[1].name}:
                            <span style={{color: colors[1]}}>{revenues[1].value.toFixed(2)} €</span>
                        </p>
                        
                    </>
                ) : (
                    <div
                        className="flex-column-center-center"
                        style={{ 
                            width: width ? String(width) + "px" : "900px",
                            height: String(height) + "px" ? height : "300px"
                        }}>
                            <p style={{fontStyle: "italic", textAlign: "center", lineHeight: "30px"}}>No revenues to display for {station.name}</p>
                    </div>
                )
            ) : (
                <div
                    className="flex-column-center-center" 
                    style={{ 
                        width: width ? String(width) + "px" : "900px",
                        height: String(height) + "px" ? height : "300px" 
                    }}>
                    <ReactLoading type="spin" color="#202020" height={80} width={80}/>
                </div>
            )}
        </div>
    );
}

export default RevenuesPieChart;
