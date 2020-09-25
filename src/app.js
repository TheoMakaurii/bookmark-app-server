require ('dotenv').config();
const  express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
// const BookmarksService = require('./bookmarks_service');
const bookmarksRouter =require('./bookmarks-router')
const app = express();
// const jsonParser = express.json();

const morganOption = (NODE_ENV === 'production')
  ? 'tiny'
  : 'common';

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.use('/bookmarks', bookmarksRouter)
// app.get('/bookmarks', (req, res, next)=>{
//   const knexInstance = req.app.get('db')
//   BookmarksService.getAllBookmarks(knexInstance)
//     .then(data => {
//       res.json(data)
//     })
//     .catch(next)
// })

// app.get('/bookmarks/:id', (req, res, next)=>{
//   const knexInstance = req.app.get('db')
//   BookmarksService.getById(knexInstance, req.params.id)
//     .then(data=>{
//       if (!data){
//         return res.status(404).json({
//           error: {message: `Bookmark doesn't exist`}
//         })
//       }
//       res.json(data)
//     })
//     .catch(next)
// })

// app.post('/bookmarks', jsonParser, (req, res, next)=>{

//   const {url, title, rating, description} = req.body
//   const newBookmark= {url, title, rating, description}
//   BookmarksService.insertBookmark(
//     req.app.get('db'),
//     newBookmark
//   )
//     .then(data=>{
//       res
//         .status(201)
//         .location(`/bookmarks/${data.id}`)
//         .json(data)
//     })
//     .catch(next)
// })


app.get('/', (req, res)=>{
  res.send('what a good destination!');
});

app.use(function errorHAndler(error, req, res, next){
    let response
    if(NODE_ENV === 'production'){
        response = {error: {message: 'whoops! server error'}}
    } else{
        console.error(error)
        response ={message: error.message, error}
    }
    res.status(500).json(response)
})

module.exports = app;