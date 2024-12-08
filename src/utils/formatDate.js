module.exports = (rawdate) => {
    const date = new Date(rawdate);

    return date.toISOString().slice(0, 10) + ' ' + date.toLocaleTimeString('en-US', { hour12: false });
}