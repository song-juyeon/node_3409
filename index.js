const http = require('http')
const fs = require('fs')
const url = require('url')
const qs = require('querystring')

function templateList(fileList) {
    let list = '<ul>';
        for(let i=0; i<fileList.length; i++){
            list += `<li> <a href="/?id=${fileList[i]}"> ${fileList[i]} </a></li>`;
        }
        list += '</ul>';
        return list;
}


function templateHTML(title, list, body, control){
    return `<!doctype html>
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
}


const app = http.createServer(function (request, response) {
    const _url = request.url
    const queryData = url.parse(_url, true).query
    const pathname = url.parse(_url, true).pathname
    if (pathname === '/') {
        if (queryData.id === undefined) {
            const title = 'Welcome'
            const description = 'Hello, Node.js'

            fs.readdir('data/', function (err,data){
                const list = templateList(data);
                // 메인화면에서는 create(새 게시글 작성)만 가능하게
                const template = templateHTML(title, list, description,
                    '<a href="create">create</a>');
                response.writeHead(200)
                response.end(template)
            });


        }
        else {
            fs.readdir('data/', function (err, data){
                fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
                    const title = queryData.id
                    const list = templateList(data)
                    // 특정 게시글을 읽고 있을땐 create(게시글 생성)와 update(수정)를 보이게
                    const template = templateHTML(title, list, description,
                        `<a href="create">create</a> <a href="/update?id=${title}">update</a>`);
                    response.writeHead(200)
                    response.end(template)
                })
            });
        }
    } else if(pathname === '/create') {
        fs.readdir('data', function (err, data){
            const title = 'Web - create';
            const list = templateList(data);
            const template = templateHTML(title, list, `
                <form action="/create_process" method="post">
                    <p><input type="text" name="title" placeholder="title"> </p>
                    <p><textarea name="description" placeholder="description"></textarea></p>                
                    <p><input type="submit"></p>
                </form>`, '')  // 글생성 중에는 create, update가 안나오게
            response.writeHead(200);
            response.end(template)
        });
    }
    else if(pathname === '/create_process'){
        // 넘겨받은 데이터를 문자열 형태로 body에 축적
        let body = '';
        request.on('data', function (data){
           body += body + data;
        });
        request.on('end', function (){
            const post = qs.parse(body);
            const title = post.title;
            const description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf-8', function (err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        })
        // response.writeHead(200);
        // response.end('success');
    }
    else {
        response.writeHead(404)
        response.end('Not found')
    }
})

app.listen(3333)