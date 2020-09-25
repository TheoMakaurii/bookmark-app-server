const express = require('express')
const BookmarksService = require('./bookmarks_service')

const bookmarksRouter = express.Router()
const jsonParser = express.json()

bookmarksRouter
  .route('/')
  .get((req, res, next) => {
    BookmarksService.getAllBookmarks(
      req.app.get('db')
    )
      .then(data => {
        res.json(data)
      })
      .catch(next)
  })
  .post(jsonParser, (req, res, next) => {
  const {url, title, rating, description} = req.body
  const newBookmark= {url, title, rating, description}

  if(!title){
      return res.status(400).json({
          error:{message: `Missing title!`}
      })
  }
    BookmarksService.insertBookmark(
      req.app.get('db'),
      newBookmark
    )
      .then(data => {
        res
          .status(201)
          .location(`/bookmarks/${data.id}`)
          .json(data)
      })
      .catch(next)
  })

bookmarksRouter
  .route('/:bookmark_id')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    BookmarksService.getById(knexInstance, req.params.bookmark_id)
      .then(data => {
        if (!data) {
          return res.status(404).json({
            error: { message: `Bookmark doesn't exist` }
          })
        }
        res.json(data)
      })
        .catch(next)
    })
    .delete((req, res, next)=>{
        BookmarksService.deleteBookmark(
        req.app.get('db'),
        req.params.bookmark_id
        )
        .then(()=>{
        res.status(204).end()
            })
        .catch(next)
        })


module.exports = bookmarksRouter