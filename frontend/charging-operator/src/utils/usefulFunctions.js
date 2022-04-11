export const my_includes = (arr, elem) => {
    for (let i=0; i<arr.length; i++) {
        if (elem === arr[i].name) return true;
    }
    return false;
}

export const upTo = (s, chars) => {
    return (s.length < chars) ? s : `${s.substring(0,chars-3)} ...`;
}
