function highlightText(text) {
    let res = [''];
    let arr = text.split(' ');

    arr.forEach((el, i) => {

        // Word starts with '@'
        // Highlight the element and append a space at the end
        if(el.startsWith('@'))
            res = [...res, <span className = 'highlight-ats'>{el}</span>, ' '];

            // Word doesn't start with '@'
        // Don't add space if it's the last element of the array
        else
            res[res.length - 1] += (i !== arr.length - 1) ? el + ' ' : el;

    })

    return res;
}

export default highlightText;
