// implement your posts router here
const express = require('express');
const Posts = require('./posts-model');

const router = express.Router();

router.get('/', (req, res) => {
    Posts.find()
        .then(post => {
            res.status(200).json(post);
        })
        .catch(error => {
            res.status(500).json({ message: "The posts information could not be retrieved"})
        })
})
router.get('/:id', (req, res) => {
    const { id } = req.params;
    Posts.findById(id)
        .then(post => {
            if(post) {
                res.status(200).json(post)
            } else {
                res.status(404).json({ message: "The post with the specified ID does not exist" })
            }
        })
        .catch(err => {
            res.status(500).json({ message: 'The post information could not be retrieved'})
        })
})

router.post('/', async (req, res) => {
    const newPost = {
        title: req.body.title,
        contents: req.body.contents,
        id: null
    }
    if(!newPost.title || !newPost.contents) {
        res.status(400).json({message: "Please provide title and contents for the post"})
    } else {
        try {
            const post = await Posts.insert(newPost)
            res.status(201).json(newPost)
        } catch {
            res.status(500).json({message: "There was an error while saving the post to the database"})
        }
    }
   
})
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const postUpdate = {
        contents: req.body.contents,
        id: Number(id),
        title: req.body.title
    }
    if (!postUpdate.contents || !postUpdate.title) {
        res.status(400).json({ message: "Please provide title and contents for the post" })
    } else {
        try {
            const updatedPost = await Posts.update(id, postUpdate)
                .then(resp => {
                    if(resp) {
                        res.status(200).json(postUpdate)
                    } else {
                        res.status(404).json({message: 'The post with the specified ID does not exist'})
                    }
                })
        } catch {
            res.status(500).json({ message: "The post information could not be modified" })
        }
    }
})
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const post = await Posts.findById(id)
        Posts.remove(id)
            .then(resp => {
                if(resp) {
                    res.status(200).json(post)
                } else {
                    res.status(404).json({message: "The post with the specified ID does not exist"})
                }
            })
    }
    catch {
        res.status(500).json({message: "The post could not be removed"})
    }
})
router.get('/:id/comments', async (req, res) => {
    const { id } = req.params
    try {
        const post = await Posts.findById(id)
        if(!post) {
            res.status(404).json({message: "The post with the specified ID does not exist"})
        } else {
            Posts.findPostComments(id)
                .then(resp => {
                    res.status(200).json(resp)
                })
        }   
    }
    catch {
        res.status(500).json({message: "The comments information could not be retrieved"})
    }
})

module.exports = router