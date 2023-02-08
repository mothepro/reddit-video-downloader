"use strict";
// TODO move these to a helper file but that requires a builder to merge all into one file.
/** Assert an expression is true. */
function assert(expression, message = 'Assertion Error') {
    if (!expression)
        throw new Error(message);
}
/** Assert an expression is not null, and returns it. */
function assertNotNull(expression, message) {
    assert(expression != null, message);
    return expression;
}
/** Downloads an auto generated file locally. */
function download(filename, text, meta = { type: 'text/csv' }) {
    const element = document.createElement('a');
    element.setAttribute('href', URL.createObjectURL(new Blob([text], meta)));
    element.setAttribute('download', filename);
    // simulate click on invisible link to start download
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    // maybe we shouldn't remove the element immediately
    // document.body.removeChild(element)
}
try {
    const { hostname, href } = location;
    assert(hostname.endsWith('reddit.com'), 'This bookmarklet only works on reddit');
    const redirect = new URL(href);
    redirect.hostname = 'redditdl.com';
    location.href = redirect.toString();
}
catch (err) {
    assert(err instanceof Error);
    alert(err.message);
}
