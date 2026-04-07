import { PrismaClient } from "@prisma/client";

import { handleResponse } from "../utilities/userUtility.js";

const prisma = new PrismaClient();

export const createEvent = async (req, res) => {
  try {
    const club = res.locals.club; // ✅ from middleware
    const clubId = club?.id;

    if (!clubId) {
      return handleResponse(res, 400, "Club context missing", false);
    }

    const {
      name,
      host,
      date,
      time,
      venue,
      duration,
      description,
      speaker,
      linkedin,
      github,
      email,
      phones,
      registrationLink
    } = req.body;

    // 🔥 combine date + time
    const eventDateTime = new Date(`${date}T${time}`);

    // 🔥 parse phones (comes as JSON string)
    const parsedPhones = Array.isArray(phones)
      ? phones.map(p => String(p))
      : [];

    // 🔥 build speakers array (for now single, scalable later)
    let speakersData = [];

    if (speaker) {
      speakersData.push({
        name: speaker,
        linkedin: linkedin || null,
        github: github || null
      });
    }

    // ✅ CREATE EVENT
    const event = await prisma.event.create({
      data: {
        name,
        venue,
        date: eventDateTime,
        duration,
        description,

        hostName: host,

        contactEmail: email,
        contactPhones: parsedPhones,

        registrationLink,

        clubId,

        // 🔥 speakers relation
        speakers: {
          create: speakersData
        }
      },
      include: {
        speakers: true,
        club: true
      }
    });

    return handleResponse(res, 201, "Event created successfully", true, event);

  } catch (error) {
    console.error(error);
    return handleResponse(res, 500, "Failed to create event", false);
  }
};

// GET /events
export const getAllEvents = async (req, res) => {
  try {
    const events = await prisma.event.findMany({
      include: {
        speakers: true,
        club: true
      },
      orderBy: {
        date: "desc"
      }
    });

    return handleResponse(res, 200, "Events fetched", true, events);

  } catch (error) {
    return handleResponse(res, 500, "Failed to fetch events", false);
  }
};

// GET /events/:id
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;

    const event = await prisma.event.findUnique({
      where: { id },
      include: {
        speakers: true,
        club: true
      }
    });

    if (!event) {
      return handleResponse(res, 404, "Event not found", false);
    }

    return handleResponse(res, 200, "Event fetched", true, event);

  } catch (error) {
    return handleResponse(res, 500, "Failed to fetch event", false);
  }
};