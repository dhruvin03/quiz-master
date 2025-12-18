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
        res.cookie('adminAuth', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
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
        message: 'Unauthorized access'
    });
};

module.exports = { adminLogin, protect };