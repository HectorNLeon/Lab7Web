let express = require('express');
let morgan = require('morgan');
let bodyParser = require('body-parser');
var cors = require('cors');
let jsonParser = bodyParser.json();
let app = express();
let moment = require('moment');
const uuidv4 = require('uuid/v4');

app.use(cors());
app.use(express.static('public'));
app.use( morgan( 'dev' ) );

let posts = [
	{
        id: uuidv4(),
        title: "Yes",
        content: "I used to know",
        author: "Hector Leon",
        publishDate: moment(Date.now()).format('MM/DD/YYYY')
	},
	{
        id: uuidv4(),
        title: "No",
        content: "I know",
        author: "Hector Leon",
        publishDate: moment(Date.now()).format('MM/DD/YYYY')
	},
	{
        id: uuidv4(),
        title: "Maybe",
        content: "I used",
        author: "Hector Leon",
        publishDate: moment(Date.now()).format('MM/DD/YYYY')
    },
	{
        id: uuidv4(),
        title: "Who knows",
        content: "used to",
        author: "Hector Leon",
        publishDate: moment(Date.now()).format('MM/DD/YYYY')
	}
];

app.get('/blog-posts',(req, res, next) => {
    return res.status(200).json(posts);
});

app.get('/blog-post',(req, res, next) => {
    let authorP = [];
    if(req.query.author == undefined)
        return res.status(406).json("Missing author");
    for(let i=0; i<posts.length; i++){
        if(posts[i].author == req.query.author)
            authorP.push(posts[i]);
    }
    if(!authorP.length)
        return res.status(404).json("Author not found");
    else
        return res.status(200).json(authorP);
});

app.post('/blog-posts', jsonParser, (req, res, next)=>{
    console.log(req.body);
    if(req.body.title && req.body.content && req.body.author && req.body.publishDate){
        let nPost = req.body;
        nPost.id = uuidv4();
        posts.push(nPost);
        return res.status(201).json(nPost);
    }
    else{
        return res.status(406).json("Missing variables in body");
    }
});

app.delete('/blog-posts/:id', (req, res, next)=>{
    for(let i=0; i<posts.length; i++){
        if(posts[i].id == req.params.id){
            posts.splice(i, 1); 
            return res.status(200).json("Success!");
        }
    }
    return res.status(404).send("That id doesn't exist");
});

app.put('/blog-posts/:id', jsonParser, (req, res, next)=>{
    if(req.body.id){
        let post = req.body;
        if(post.id != req.params.id)
            return res.status(409).json("Ids don't match");

        for(let i=0; i<posts.length; i++){
            if(posts[i].id == req.params.id){
                if(post.title)
                    posts[i].title = post.title;
                if(post.content)
                    posts[i].content = post.content;
                if(post.author)
                    posts[i].author = post.author;
                if(post.publishDate)
                    posts[i].publishDate = post.publishDate;
                return res.status(202).json(posts);
            }
        }
    }
    else{
        return res.status(406).json("Missing id in body");
    }
});

app.listen( '8080', () => {
	console.log( "App running on localhost:8080" );
});
