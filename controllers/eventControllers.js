import { PrismaClient } from "@prisma/client";

import { buildEventFilter, handleResponse } from "../utilities/userUtility.js";

const prisma = new PrismaClient();

export const createEvent = async (req, res) => {
  try {
    const club = res.locals.club;
    const clubId = club?.id;

    if (!clubId) {
      return handleResponse(res, 400, "Change the role from the profile", false);
    }

    const {
      name, hostName, date, time, venue, duration,
      description, speaker, linkedin, github,
      contactEmail, contactPhones, registrationLink
    } = req.body;

    const eventDateTime = new Date(`${date}T${time}`);

    // ✅ phones sent as JSON string from FormData
    const parsedPhones = (() => {
      try { return JSON.parse(contactPhones); }
      catch { return Array.isArray(contactPhones) ? contactPhones : []; }
    })();

    // ✅ Cloudinary URL from multer
    const brochureUrl = req.file?.path || null;

    let speakersData = [];
    if (speaker) {
      speakersData.push({
        name: speaker,
        linkedin: linkedin || null,
        github: github || null,
      });
    }

    const event = await prisma.event.create({
      data: {
        name, venue,
        date: eventDateTime,
        duration, description,
        hostName,
        contactEmail,
        contactPhones: parsedPhones,
        registrationLink,
        brochureUrl,          // ✅ saved here
        clubId,
        speakers: { create: speakersData },
      },
      include: { speakers: true, club: true },
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

export const getFilteredEvents = async (req, res) => {
  try {
    const filters = buildEventFilter(req.query);

    const events = await prisma.event.findMany({
      where: filters.where,
      orderBy: filters.orderBy,
      include: {
        club: true,
        speakers: true,
      },
    });

    return handleResponse(res, 200, "Filtered events", true, events);

  } catch (error) {
    console.error("Filter error", error);
    return handleResponse(res, 500, "Something went wrong", false);
  }
};