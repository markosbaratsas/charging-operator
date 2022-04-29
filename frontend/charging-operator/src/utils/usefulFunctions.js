export const my_includes = (arr, elem) => {
    for (let i=0; i<arr.length; i++) {
        if (elem === arr[i].name) return true;
    }
    return false;
}

export const upTo = (s, chars) => {
    return (s.length < chars) ? s : `${s.substring(0,chars-3)} ...`;
}

export const next_hours = (dt, hours_later) => {
    let day = dt.substring(0, 2);
    let monthIndex = parseInt(dt.substring(3, 5)) - 1;
    let year = dt.substring(6, 10);
    let hours = dt.substring(11, 13);
    let minutes = dt.substring(14, 16);

    let givenDate = new Date(year, monthIndex, day, hours, minutes);
    let date_hours_later = new Date(new Date().getTime() + 60 * 60 * hours_later * 1000);
    return (givenDate < date_hours_later);
}
