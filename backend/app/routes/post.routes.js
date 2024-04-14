/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       required:
 *         - title
 *         - author
 *         - finished
 *       properties:
 *         id:
 *           type: string
 *           description: The auto-generated id of the post
 *         channel:
 *           type: string
 *           description: Origin Channel of the post
 *         text:
 *           type: string
 *           description: Post full content
 *         postDate:
 *           type: string
 *           format: date
 *           description: Timestamp of post created
 *         author:
 *           type: string
 *           description: Author of the post
 *         media:
 *            type: string
 *            description: Filename of the media file of the post saved to local
 *         reactions:
 *            type: object
 *            description: Array of reactions with count at scraped time
 *         createdAt:
 *           type: string
 *           format: date
 *           description: The date the post was added to database
 *       example:
 *         id: 123
 *         channel: The New Turing Omnibus
 *         text: Alexander K. Dewdney
 *         postDate: 2020-03-10T04:05:06.157Z
 *         author: None
 *         media: 4753903dca0c12568716f.jpg
 *         reactions: [
 *                       {
 *                         "count": 782,
 *                         "reaction": "👍"
 *                       },
 *                       {
 *                         "count": 252,
 *                         "reaction": "❤"
 *                       }]
 */

/**
 * @swagger
 * tags:
 *   name: Posts
 *   description: The Posts managing API
 * /api/posts:
 *   get:
 *     summary: Lists all the posts
 *     tags: [Posts]
 *     parameters:
 *       - in: query
 *         name: size
 *         schema:
 *           type: int
 *         description: return size of post list
 *       - in: query
 *         name: page
 *         schema:
 *           type: int
 *         description: page number for pagination
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *         description: startDate filter for the posts
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *         description: endDate filter for the posts
 *     responses:
 *       200:
 *         description: The list of the posts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Post'
 *
 */


module.exports = app => {
    const posts = require("../controllers/post.controller.js");
  
    var router = require("express").Router();
  

    // Retrieve all Posts
    router.get("/", posts.findAll);
  
    // Retrieve Posts within date specified
    // router.get("/id", posts.findOne);

    // Retrieve a single Post with id
    router.get("/:id", posts.findOne);
  
    
    // Delete a Post with id
    // router.delete("/:id", posts.delete);
  
    // Create a new Post
    // router.delete("/", posts.deleteAll);
  
    app.use("/api/posts", router);
  };