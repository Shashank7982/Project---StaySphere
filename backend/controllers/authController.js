const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

// GET Auth Status (for React to check login state)
exports.getStatus = function (req, res, next) {
    if (req.session.isLoggedIn && req.session.user) {
        res.json({
            isLoggedIn: true,
            user: {
                _id: req.session.user._id,
                firstName: req.session.user.firstName,
                lastName: req.session.user.lastName,
                email: req.session.user.email,
                userType: req.session.user.userType
            }
        });
    } else {
        res.json({ isLoggedIn: false, user: null });
    }
};

// POST Signup Logic
exports.postSignup = [
    check("firstName").trim().isLength({ min: 2 }).withMessage("First name must be at least 2 characters long"),
    check("lastName").trim(),
    check("email").isEmail().withMessage("Please enter a valid email").normalizeEmail(),
    check("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long").trim(),
    check("confirmPassword").trim().custom(function (value, { req }) {
        if (value !== req.body.password) {
            throw new Error("Passwords do not match");
        }
        return true;
    }),
    check("userType").notEmpty().withMessage("User type is required"),

    async function (req, res, next) {
        const { firstName, lastName, email, password, userType } = req.body;
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array(), oldInputs: { firstName, lastName, email, userType } });
        }

        try {
            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({ firstName, lastName, email, password: hashedPassword, userType });
            await user.save();
            res.status(201).json({ message: 'Account created successfully. Please log in.' });
        } catch (err) {
            console.log("Error saving user to database", err);
            res.status(500).json({ errors: [{ msg: "Registration failed. Email might already exist." }] });
        }
    }
];

// POST Login Logic
exports.postLogin = async function (req, res, next) {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ errors: ["Invalid email or password"] });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            await req.session.save();
            return res.json({
                message: 'Login successful',
                user: {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    userType: user.userType
                }
            });
        } else {
            return res.status(401).json({ errors: ["Invalid email or password"] });
        }
    } catch (err) {
        console.log("Login Error:", err);
        res.status(500).json({ errors: ["Internal Server Error"] });
    }
};

// POST Logout
exports.postLogOut = function (req, res, next) {
    req.session.destroy(function (err) {
        if (err) {
            console.log("Logout Error:", err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.json({ message: 'Logged out successfully' });
    });
};