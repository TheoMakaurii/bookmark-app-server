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