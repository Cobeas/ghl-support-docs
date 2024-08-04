module.exports = {
    app: [{
        name: "ghl-support-docs",
        script: "npm",
        arg: "start",
        watch: true,
        env: {
            "NODE_ENV": "production",
            "PORT": 3001
        }
    }]
};