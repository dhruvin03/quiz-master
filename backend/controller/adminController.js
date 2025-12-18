const { setMaxListeners } = require("../models/Quiz");

const adminLogin = (req, res) => {
    const { email, password } = req.body;

    // Validate email and password presence
    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
        // Set cookie with environment-aware security settings
        const isProduction = process.env.NODE_ENV === 'production';
        
        res.cookie('adminAuth', 'true', {
            httpOnly: true,
            secure: isProduction, // Use secure cookies in production (HTTPS)
            sameSite: isProduction ? 'none' : 'lax', // 'none' for cross-site in production
            maxAge: 24 * 60 * 60 * 1000 // 24 hours
        });
        
        return res.status(200).json({
            success: true,
            message: 'Admin login successful'
        });
    }

    return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
    });
};

const protect = (req, res, next) => {
    const adminAuth = req.cookies.adminAuth;
    
    if (adminAuth === 'true') {
        return next();
    }

    return res.status(401).json({
        success: false,
        message: 'Unauthorized access. Please login.'
    });
};

const logout = (req, res) => {
    res.clearCookie('adminAuth');
    return res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

const checkAuth = (req, res) => {
    const adminAuth = req.cookies.adminAuth;
    
    if (adminAuth === 'true') {
        return res.status(200).json({
            success: true,
            isAuthenticated: true
        });
    }

    return res.status(401).json({
        success: false,
        isAuthenticated: false
    });
};

module.exports = { adminLogin, protect, logout, checkAuth };