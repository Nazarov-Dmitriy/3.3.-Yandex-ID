const express = require('express')
const router = express.Router()
const fileMulter = require('../middleware/file')
const {
    v4: uuid
} = require('uuid')

class Book {
    constructor(title = "", description = "", authors = "", favorite = "", fileCover = "", fileName = "", fileBook = "", id = uuid()) {
        this.id = id,
            this.title = title,
            this.description = description,
            this.authors = authors,
            this.favorite = favorite,
            this.fileCover = fileCover,
            this.fileName = fileName,
            this.fileBook = fileBook
    }
}

const stor = {
    books: [
        new Book('книга1', 'описание книги 1', "Автор1", "неизвестно", "неизвестно", "книга1", "book1.txt"),
        new Book('книга2', 'описание книги 2', "Автор2", "неизвестно", "неизвестно", "книга2", "book1.txt"),
    ],
};

router.get('/api/books', (req, res) => {
    const {
        books
    } = stor
    res.render("books/index", {
        title: "Книги",
        books: books,
    });
})

router.delete('/api/books/:id', (req, res) => {
    const {
        books
    } = stor
    const {
        id
    } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx === -1) {
        res.redirect('/404');
    }
    books.splice(idx, 1);
    res.redirect(`/api/books`);
})



router.get('/api/books/:id', (req, res) => {
    const {
        books
    } = stor
    const {
        id
    } = req.params
    const idx = books.findIndex(el => el.id === id)

    if (idx === -1) {
        res.redirect('/404');
    }

    res.render("books/view", {
        title: "Книга ",
        book: books[idx],
    });
})

router.get('/api/create/', (req, res) => {
    res.render("books/create", {
        title: "Создать книгу",
        book: {},
    });
});

router.post('/api/create/', fileMulter.single('fileBook'), (req, res) => {
    const {
        books
    } = stor
    const {
        title,
        description,
        authors,
        favorite,
        fileCover,
        fileName,
    } = req.body
    const {
        fileBook
    } = req.body


    const newBook = new Book(title, description, authors, favorite, fileCover, fileName, fileBook)
    books.push(newBook)

    res.redirect('/api/books')
})

router.get('/api/books/update/:id', (req, res) => {
    const {
        books,
    } = stor;
    const {
        id
    } = req.params;
    const idx = books.findIndex(el => el.id === id);
    if (idx === -1) {
        res.redirect('/404');
    }


    res.render("books/update", {
        title: "Редактировать книгу",
        book: books[idx]
    });
});


router.put('/api/books/update/:id', (req, res) => {
    const {
        books
    } = stor
    const {
        title,
        description,
        authors,
        favorite,
        tfileCover,
        fileName,
        fileBook
    } = req.body
    const {
        id
    } = req.params
    const idx = books.findIndex(el => el.id === id)


    if (idx === -1) {
        res.redirect('/404');
    }
    books[idx] = {
        ...books[idx],
        title,
        description,
        authors,
        favorite,
        tfileCover,
        fileName,
        fileBook
    };
    res.redirect(`/api/books`);
})



module.exports = router