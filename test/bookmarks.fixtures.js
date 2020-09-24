function makeBookmarksArray(){

    return[

            {url:'https://www.google.com', 
            id: 1,
            title:'Google', 
            rating: 5, 
            description: 'a search engine'},

             {url:'https://www.test.com', 
             id: 2,
             title:'Test', 
             rating: 4, 
             description: 'a test engine'},

             {url:'https://www.google.com', 
             id:3,
             title:'Google', 
             rating: 3, 
             description: 'a search engine'},

            { url:'https://www.test.com', 
            id:4,
            title:'Test', 
            rating: 2, 
            description: 'a test engine'},  

    ]
};

module.exports= {
    makeBookmarksArray,
}