/**
 * @swagger
 * components:
 *   schemas:
 *     Auction:
 *       type: object
 *       required:
 *         - item_id
 *         - reserve_price
 *         - duration
 *       properties:
 *         id:
 *           type: integer
 *           description: Auction ID
 *         item_id:
 *           type: string
 *           description: Item identifier
 *         reserve_price:
 *           type: string
 *           description: Minimum price in utestcore
 *         buy_now_price:
 *           type: string
 *           description: Optional buy now price
 *         highest_bid:
 *           type: string
 *           description: Current highest bid
 *         highest_bidder:
 *           type: string
 *           description: Address of highest bidder
 *         end_time:
 *           type: integer
 *           description: Unix timestamp when auction ends
 *         active:
 *           type: boolean
 *           description: Whether auction is active
 *     Bid:
 *       type: object
 *       required:
 *         - auction_id
 *         - amount
 *       properties:
 *         auction_id:
 *           type: integer
 *           description: Auction ID
 *         amount:
 *           type: string
 *           description: Bid amount in utestcore
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 * 
 * @swagger
 * tags:
 *   - name: Auctions
 *     description: Auction management endpoints
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: System
 *     description: System health and status
 */

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     tags: [System]
 *     responses:
 *       200:
 *         description: System healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: User already exists
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *       401:
 *         description: Invalid credentials
 */

/**
 * @swagger
 * /api/auctions:
 *   get:
 *     summary: List all auctions
 *     tags: [Auctions]
 *     responses:
 *       200:
 *         description: List of auctions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auction'
 */

/**
 * @swagger
 * /api/auctions:
 *   post:
 *     summary: Create a new auction
 *     tags: [Auctions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - item_id
 *               - reserve_price
 *               - duration
 *             properties:
 *               item_id:
 *                 type: string
 *               reserve_price:
 *                 type: string
 *               buy_now_price:
 *                 type: string
 *               duration:
 *                 type: integer
 *                 description: Duration in seconds
 *     responses:
 *       201:
 *         description: Auction created
 */

/**
 * @swagger
 * /api/auctions/{id}:
 *   get:
 *     summary: Get auction by ID
 *     tags: [Auctions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Auction details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auction'
 *       404:
 *         description: Auction not found
 */

/**
 * @swagger
 * /api/auctions/{id}/bid:
 *   post:
 *     summary: Place a bid on an auction
 *     tags: [Auctions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *             properties:
 *               amount:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bid placed successfully
 *       400:
 *         description: Bid too low or auction ended
 *       404:
 *         description: Auction not found
 */

/**
 * @swagger
 * /api/auctions/{id}/end:
 *   post:
 *     summary: End an auction
 *     tags: [Auctions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Auction ended
 *       403:
 *         description: Only seller or admin can end auction
 */
