import { Router } from 'express';

import { getAllNotes, getNoteById, createNote, updateNote, deleteNote } from '../controllers/noteController.js';

/**
 * @swagger
 * components:
 *   schemas:
 *     Notes:
 *       type: object
 *       required:
 *         - title (Only for creation)
 *       properties:
 *         id:
 *           type: integer
 *           description: The auto-generated ID of the note
 *         title:
 *           type: string
 *           description: The title of the note
 *         description:
 *           type: string
 *           description: The content or description of the note
 *         favorite:
 *           type: boolean
 *           description: Whether the note is marked as favorite
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the note was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time when the note was last updated
 *       example:
 *         id: 1
 *         title: My First Note
 *         description: This is a description of my first note.
 *         favorite: false
 *         createdAt: 2023-08-11T04:05:06.157Z
 *         updatedAt: 2023-08-11T04:05:06.157Z
 *     NotFound:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *       example:
 *         error: Note not found
 *     FailedRequest:
 *       type: object
 *       properties:
 *         error:
 *           type: string
 *           description: Error message
 *       example:
 *         error: Failed to retrieve the note
 *     CreateNote:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         descrition:
 *           type: string
 *         favorite:
 *           type: boolean
 *       example:
 *         title: Creating a new Note
 *         descrition: Describing my Note
 *         favorite: true
 *
 *     UpdateNote:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         descrition:
 *           type: string
 *         favorite:
 *           type: boolean
 *       example:
 *         title: Updating a new Note
 *         descrition: Describing my Note update
 *         favorite: true
 *
 */
const router = Router();

/**
 * @openapi
 * tags:
 *   name: Notes
 *   descrition: The Notes managin API
 * /api/notes/:
 *   get:
 *     summary: List all notes
 *     tags: [Notes]
 *     parameters:
 *      - in: query
 *        name: search
 *        description: A term to search across title and description
 *        required: false
 *        schema:
 *          type: string
 *     responses:
 *       200:
 *         description: The list of the notes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 notes:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Notes'
 *                   properties:
 *                     id: 
 *                       type: integer
 *                     title:
 *                       type: string
 *                     descrition:
 *                       type: string
 *                     favorite:
 *                       type: boolean
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailedRequest'
 *
 *   post:
 *     summary: Create a new note
 *     tags: [Notes]
 *     requestBody:
 *       description: >
 *         The only required field is the **Title** and **Description**.
 *         But you can send **Favorite** as well.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateNote'
 *     responses:
 *       200:
 *         description: The created note.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notes'
 *       400:
 *         description: Your note body is not valid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: [
 *                     Title must be between 1 and 255 characters long,
 *                     Description must be between 1 and 10000 characters long
 *                   ]
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailedRequest'
 *
 * /api/notes/{id}:
 *   get:
 *     summary: Get the note by id
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The note id
 *     responses:
 *       200:
 *         description: The note response by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notes'
 *       404:
 *         description: The note was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailedRequest'
 *   put:
 *     summary: Update the note by the id
 *     description: >
 *       Update only the fields: **Title**, **Description**, **Favorite**.
 *       It must receive at least one field to update.
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The note id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateNote'
 *     responses:
 *       200:
 *         description: The note was updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Notes'
 *       404:
 *         description: The note was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailedRequest'
 *   delete:
 *     summary: Remove the note by id
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The note id
 *
 *     responses:
 *       204:
 *         description: The note was deleted successfully
 *       404:
 *         description: The note was not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NotFound'
 *       500:
 *         description: Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/FailedRequest'
 */
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', createNote);
router.put('/:id', updateNote);
router.delete('/:id', deleteNote);

export default router;
