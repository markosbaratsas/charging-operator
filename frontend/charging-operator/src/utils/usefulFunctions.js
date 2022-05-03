export const my_includes = (arr, elem) => {
    for (let i=0; i<arr.length; i++) {
        if (elem === arr[i].name) return true;
    }
    return false;
}

export const my_includes2 = (arr, elem) => {
    for (let i=0; i<arr.length; i++) {
        if (elem === arr[i].id) return true;
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

export const getTimeString = (dt) => {
    const integerToFixedString = (x, number_of_digits) => {
        let s = "";
        for (let i=0; i<number_of_digits - x.toString().length; i++) {
            s += "0";
        }
        return s + x.toString();
    }

    let year = integerToFixedString(dt.getFullYear(), 4);
    let month = integerToFixedString(dt.getMonth() + 1, 2);
    let day = integerToFixedString(dt.getDay() + 1, 2);
    let hours = integerToFixedString(dt.getHours(), 2);
    let minutes = integerToFixedString(dt.getMinutes(), 2);
    let seconds = integerToFixedString(dt.getSeconds(), 2);

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export const stringToDatetime = (s) => {
    let day = parseInt(s.split("/")[0]);
    let month = parseInt(s.split("/")[1]) - 1;
    let year = parseInt(s.split("/")[2].split(" ")[0]);
    let hours = parseInt(s.split("/")[2].split(" ")[1].split(":")[0]);
    let minutes = parseInt(s.split("/")[2].split(" ")[1].split(":")[1]);

    return new Date(year, month, day, hours, minutes);
}

export const stringToISOString = (s) => {
    let day = s.split("/")[0];
    let month = s.split("/")[1];
    let year = s.split("/")[2].split(" ")[0];
    let hours = s.split("/")[2].split(" ")[1].split(":")[0];
    let minutes = s.split("/")[2].split(" ")[1].split(":")[1];

    return `${year}-${month}-${day}T${hours}:${minutes}`;
}
