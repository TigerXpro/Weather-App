const { getHome, getAbout } = {
    // GET /
    getHome: (req, res) => {
        res.render("index", {
            title: "Weather Search",
            user: req.user || null
        });
    },

    // GET /about
    getAbout: (req, res) => {
        res.render("about", {
            title: "About Weather App"
        });
    }
};

module.exports = { getHome, getAbout };