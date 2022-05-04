const TableRow = ({description, value, help}) => {
    return (
        <>
            <div className="full-width flex-row-between-center">
                <div className="flex-column-start-start reservation-view-titles">
                    <h3>{description}</h3>
                </div>
                <div className="flex-column-start-start reservation-view-numbers">
                    <h4>{value}</h4>
                </div>
            </div>
            {help ?
            <p>{help}</p>
            : null}
        </>
    );
}

export default TableRow;
