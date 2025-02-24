const mongoose = require("mongoose");

const isURL = (value) => {
    const regex = /^(ftp|http|https):\/\/[^ "]+$/;
    return regex.test(value);
};

const eventSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        eventDate: {
            type: Date,
            required: true,
        },
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        location: {
            type: String,
            required: function () {
                return !this.isVirtual;
            },
        },
        isVirtual: {
            type: Boolean,
            default: false,
        },
        description: {
            type: String,
            required: true,
        },
        imageUrl: {
            type: String,
            required: true,
        },
        eventUrl: {
            type: String,
            validate: {
                validator: function (value) {
                    if (this.isVirtual) {
                        return isURL(value);
                    }
                    return true;
                },
                message: "Invalid URL",
            },
            required: function () {
                return this.isVirtual;
            },
        },
    },
    {
        timestamps: true,
    }
);

eventSchema.pre("save", function (next) {
    if (this.isVirtual) {
        this.location = null;
    } else {
        this.eventUrl = null;
    }
    next();
});

module.exports = mongoose.model("Event", eventSchema);
