import jwt from "jsonwebtoken";
import { hash, compare } from "bcryptjs";

export const handleResponse = (res, status, message, success, data = null) => {
  return res.status(status).json({
    success,
    message,
    data
  });
};

export async function hashPassword(password) {
  const saltRounds = 10;
  const hashPassword = await hash(password, saltRounds);
  return hashPassword;
}

export async function comparePassword(userPass, hashPass) {
  const isMatch = await compare(userPass, hashPass);
  return isMatch;
}

export function createTokenUser(userId, activeClubId = null) {
  const payload = {
    userId,
  };

  // add club only if provided
  if (activeClubId) {
    payload.activeClubId = activeClubId;
  }

  const token = jwt.sign(
    payload,
    process.env.SECRET,
    { expiresIn: "30m" }
  );

  return token;
}

export function clubUpdateFilter(body) {
  const updateBody = {};
  if (body.name) updateBody.name = body.name;
  if (body.description) updateBody.description = body.description;
  if (body.clubCoordinator) updateBody.clubCoordinator = body.clubCoordinator;

  return updateBody;
}

export function buildEventFilter(query) {
  const where = {};
  const orderBy = {};

  // 🔍 SEARCH (name + description)
  if (query.search) {
    where.OR = [
      { name: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } },
    ];
  }

  // 🏫 CLUB FILTER
  if (query.clubId) {
    where.clubId = query.clubId;
  }

  if (query.clubName) {
    where.club = {
      name: query.clubName
    };
  }

  // 📍 VENUE FILTER
  if (query.venue) {
    where.venue = {
      contains: query.venue,
      mode: "insensitive",
    };
  }

  // 👤 HOST FILTER
  if (query.hostName) {
    where.hostName = {
      contains: query.hostName,
      mode: "insensitive",
    };
  }

  // 📅 DATE FILTER
  if (query.dateFilter) {
    const now = new Date();

    if (query.dateFilter === "today") {
      const start = new Date();
      start.setHours(0, 0, 0, 0);

      const end = new Date();
      end.setHours(23, 59, 59, 999);

      where.date = { gte: start, lte: end };
    }

    if (query.dateFilter === "week") {
      const end = new Date();
      end.setDate(now.getDate() + 7);

      where.date = { gte: now, lte: end };
    }

    if (query.dateFilter === "month") {
      const end = new Date();
      end.setMonth(now.getMonth() + 1);

      where.date = { gte: now, lte: end };
    }
  }

  // 🔽 SORT
  if (query.sort === "oldest") {
    orderBy.date = "asc";
  } else {
    orderBy.date = "desc"; // default latest
  }

  return { where, orderBy };
}