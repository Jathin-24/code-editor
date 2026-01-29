const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rollNo: {
        type: String,
        required: true,
        trim: true,
        uppercase: true
    },
    html: {
        type: String,
        default: '<!-- Write your HTML here -->\n<h1>Hello World!</h1>'
    },
    css: {
        type: String,
        default: '/* Write your CSS here */\nbody {\n  font-family: Arial, sans-serif;\n  padding: 20px;\n}'
    },
    javascript: {
        type: String,
        default: '// Write your JavaScript here\nconsole.log("Hello from JavaScript!");'
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update timestamp on save
projectSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = mongoose.model('Project', projectSchema);
