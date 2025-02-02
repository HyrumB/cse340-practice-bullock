const mode = process.env.MODE || "production";
const port = process.env.PORT || 3000;

const injectorSetup = (req, res, next) => {

    res.locals.port = port;
    res.locals.isDevMode = mode.includes('dev');
    res.locals.devModeMsg = '';

    // Initialize injection arrays
    res.locals.scripts = [];
    res.locals.styles = [];

    next();
}

export default injectorSetup;
