export const convertDate = (val) => {
    var d = new Date(val);
    var date = d.toLocaleString()
    return date
}

