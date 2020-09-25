const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const{makeBookmarksArray} = require('./bookmarks.fixtures')
const supertest = require('supertest')

describe.only('Bookmarks Endpoints', function() {
    let db 

    before('make knex instance', ()=>{
        db =knex({
            client: 'pg',
            connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', ()=> db.destroy())

    before('clean the table', ()=> db('bookmarks_table').truncate())

    afterEach('cleanup', () => db('bookmarks_table').truncate())

    describe('GET /bookmarks', ()=>{
      context('Given that there are bookmarks in the database', ()=>{
        const testItems = makeBookmarksArray()
        
            beforeEach('insert bookmarks', () => {
                  return db
                    .into('bookmarks_table')
                    .insert(testItems)
                })

                it ('responds with 200 and all of the items', ()=>{
                    return supertest(app)
                        .get('/bookmarks')
                        .expect(200, testItems)
                })
            })

            context(`Given no bookmarks`, () => {
                it(`responds with 200 and an empty list`, () => {
                  return supertest(app)
                    .get('/bookmarks')
                    .expect(200, [])
                })
            })
        })
    describe(`POST /bookmarks`, ()=>{
        it(`creates an item, responding with 201 and the new bookmark`, function(){
            const newItem={
                url: 'https://www.test.com',
                title: 'Test',
                rating: 3,
                description: 'A testing site'
            }
            return supertest(app)
            .post('/bookmarks')
            .send(newItem)
            .expect(201)
            .expect(res =>{
                expect(res.body.url).to.eql(newItem.url)
                expect(res.body.title).to.eql(newItem.title)
                expect(res.body.rating).to.eql(newItem.rating)
                expect(res.body.description).to.eql(newItem.description)
                expect(res.body).to.have.property('id')
                expect(res.headers.location).to.eql(`/bookmarks/${res.body.id}`)
            })
 
                .then(postRes=>
                    supertest(app)
                        .get(`/bookmarks/${postRes.body.id}`)
                        .expect(postRes.body)
                )
            })

            it(`responds with 400 and an error message when the title is missing`, ()=>{
                return supertest(app)
                .post('/bookmarks')
                .send({
                    url: 'https://www.test.com',
                    rating: 3,
                    description: 'A testing site'
                })
                .expect(400, {
                    error: {message: `Missing title!`}
                })
            })
        })


    describe('GET /bookmarks/:id', ()=>{

        context(`Given no items`, ()=>{
            it(`responds with 404`, ()=>{
                const id =12345  
                return supertest(app)
                    .get(`/bookmarks/${id}`)
                    .expect(404, {error:{message: `Bookmark doesn't exist`}})
            })
        })

        context('Given there are articles in the database', ()=>{
            const testItems = makeBookmarksArray()

            beforeEach('insert bookmarks', () =>{
                return db   
                    .into('bookmarks_table')
                    .insert(testItems)
                })

                it('responds with 200 and specified bookmark', ()=>{
                    const bookmarkId = 2
                    const expectedBookmark = testItems[bookmarkId - 1]
                    return supertest(app)
                        .get(`/bookmarks/${bookmarkId}`)
                        .expect(200, expectedBookmark)
                })
        })
    })
})