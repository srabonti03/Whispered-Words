const router = require("express").Router();
const Event = require("../models/event");
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");
const cron = require("node-cron");
const multer = require("multer");
const path = require('path');

// Set up Multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/');
    },
    filename: (req, file, cb) => {
        const eventName = req.body.name.replace(/\s+/g, '-').toLowerCase();
        cb(null, eventName + '-' + Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage });

// Add Event
router.post("/addevent", authenticateToken, upload.single("image"), async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);
        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        const { name, eventDate, startTime, endTime, isVirtual, description, eventUrl, location } = req.body;

        if (!name || !eventDate || !startTime || !endTime || !description) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const isVirtualEvent = isVirtual === 'true' || isVirtual === true;

        if (isVirtualEvent) {
            if (!eventUrl) {
                return res.status(400).json({ message: "Event URL is required for virtual events" });
            }
            if (location) {
                return res.status(400).json({ message: "Location should not be provided for virtual events" });
            }
        } else {
            if (!location) {
                return res.status(400).json({ message: "Location is required for non-virtual events" });
            }
            if (eventUrl) {
                return res.status(400).json({ message: "Event URL should not be provided for non-virtual events" });
            }
        }

        const imageUrl = req.file ? `/public/${req.file.filename}` : null;

        const event = new Event({
            name,
            eventDate,
            startTime,
            endTime,
            isVirtual: isVirtualEvent,
            description,
            eventUrl: isVirtualEvent ? eventUrl : null,
            location: isVirtualEvent ? null : location,
            imageUrl: imageUrl,
            user: id,
        });

        await event.save();
        res.status(201).json({ message: 'Event added successfully', event });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
});

// Update Event - Admin only
router.put("/updateevent/:eventId", authenticateToken, upload.single("image"), async (req, res) => {
    try {
        const { id } = req.user;
        const eventId = req.params.eventId;
        const { name, eventDate, startTime, endTime, location, isVirtual, description, eventUrl } = req.body;

        const user = await User.findById(id);
        if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        const event = await Event.findById(eventId);
        if (!event) {
        return res.status(404).json({ message: 'Event not found' });
        }

        if (!name || !eventDate || !startTime || !endTime || !description) {
        return res.status(400).json({ message: 'All fields are required' });
        }

        const isVirtualEvent = isVirtual === 'true' || isVirtual === true;

        if (isVirtualEvent) {
        if (!eventUrl) {
            return res.status(400).json({ message: 'Event URL is required for virtual events' });
        }
        if (location) {
            return res.status(400).json({ message: 'Location should not be provided for virtual events' });
        }
        } else {
        if (!location) {
            return res.status(400).json({ message: 'Location is required for non-virtual events' });
        }
        if (eventUrl) {
            return res.status(400).json({ message: 'Event URL should not be provided for non-virtual events' });
        }
        }

        const imageUrl = req.file ? `/public/${req.file.filename}` : event.imageUrl;

        const updatedEvent = await Event.findByIdAndUpdate(eventId, {
        name,
        eventDate,
        startTime,
        endTime,
        isVirtual: isVirtualEvent,
        description,
        eventUrl: isVirtualEvent ? eventUrl : null,
        location: isVirtualEvent ? null : location,
        imageUrl: imageUrl
        }, { new: true });

        res.status(200).json({ message: 'Event updated successfully', event: updatedEvent });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
    });

// Delete Event - Admin only
router.delete("/deleteevent/:eventId", authenticateToken, async (req, res) => {
    try {
        const { id } = req.user;
        const user = await User.findById(id);

        if (!user || user.role !== 'admin') {
            return res.status(403).json({ message: "Forbidden: Admin access required" });
        }

        const { eventId } = req.params;

        const eventExists = await Event.findById(eventId);
        if (!eventExists) {
            return res.status(404).json({ message: "Event not found" });
        }

        if (eventExists.image) {
            const imagePath = `public/${eventExists.image.split('/')[2]}`;
            fs.unlink(imagePath, (err) => {
                if (err) {
                    console.error('Error deleting image file:', err);
                }
            });
        }

        await Event.findByIdAndDelete(eventId);
        res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error("Delete event error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// All Event - Public
router.get("/allevents", async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json({ status: "success", data: events });
    } catch (error) {
        console.error("Get all events error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Get Event Details - Public
router.get("/eventdetails/:eventId", async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        res.json({ status: "success", data: event });
    } catch (error) {
        console.error("Get event details error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Convert Date to 24-hour format
const convertToDate = (timeString, date) => {
    if (!timeString || !date) {
        console.error("Error: Both timeString and date must be provided", { timeString, date });
        return null;
    }

    const [time, period] = timeString.split(" ");
    if (!time || !period) {
        console.error("Error: Invalid time format, should be in 'HH:MM AM/PM' format", { timeString });
        return null;
    }

    const [hours, minutes] = time.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) {
        console.error("Error: Invalid hour or minute value", { hours, minutes });
        return null;
    }

    let adjustedHours = hours % 12;

    if (period === "PM" && hours !== 12) {
        adjustedHours += 12;
    } else if (period === "AM" && hours === 12) {
        adjustedHours = 0;
    }

    const fullDate = new Date(date);
    fullDate.setHours(adjustedHours, minutes, 0, 0);

    return fullDate;
};

// Schedule a task to run every minute
cron.schedule("* * * * *", async () => {
    try {
        const currentTime = new Date();
        const events = await Event.find();
        for (let event of events) {
            const eventEndTime = new Date(event.eventDate);
            const [hours, minutes] = event.endTime.split(":");
            eventEndTime.setHours(hours);
            eventEndTime.setMinutes(minutes);
            eventEndTime.setSeconds(0);

            if (eventEndTime < currentTime) {
                await Event.deleteOne({ _id: event._id });
                console.log(`Expired event with ID: ${event._id} deleted.`);
            }
        }
    } catch (error) {
        console.error("Error deleting expired events:", error);
    }
});


module.exports = router;
