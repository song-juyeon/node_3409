module.exports = {
    HTML: function (title, list, body, control){
        return `
          <!doctype html>
          <html lang="ko">
          <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
          </head>
          <body>
            <h1><a href="/">WEB</a></h1>
            ${list}
            <h2>${title}</h2>
            ${control}
            <p>${body}</p>
          </body>
          </html>
          `
    },
    List: function (filelist){
        let list = '<ul>';
        for(let i=0; i<filelist.length; i++) {
            list += `<li> <a href="/?id=${filelist[i]}"> ${filelist[i]} </a> </li>`;
        }
        list += '</ul>';
        return list;
    }
}