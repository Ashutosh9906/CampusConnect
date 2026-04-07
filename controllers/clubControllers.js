import { PrismaClient } from "@prisma/client";

import { clubUpdateFilter, handleResponse } from "../utilities/userUtility.js";

const prisma = new PrismaClient();

export const handleGetAllClub = async (req, res, next) => {
  try {
    const clubDetails = await prisma.club.findMany();
    return res.status(200).json({
      success: true,
      message: "Club details fetchedd successfully",
      clubDetails
    });
  } catch (error) {
    console.error("Getting club details failed", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}

export const handleGetClubById = async (req, res, next) => {
  try {
    const clubId = res.locals.validated.params.id;

    const clubDetails = await prisma.club.findUnique({
      where: { id: clubId }
    })

    if (!clubDetails) {
      return res.status(409).json({
        success: false,
        message: "Club already exists.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Club details fetched successfully",
      clubDetails
    });
  } catch (error) {
    console.error("Getting club details by ID failed", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}

export const handleAddNewClub = async (req, res, next) => {
  try {
    const { name, description, clubCoordinator } = res.locals.validated.body;

    const existingClub = await prisma.club.findUnique({
      where: { name }
    })

    if (existingClub) {
      return res.status(409).json({
        success: false,
        message: "Club already exists.",
      });
    }

    const club = await prisma.club.create({
      data: {
        name,
        description,
        clubCoordinator
      }
    })

    return res.status(201).json({
      success: true,
      message: "Club added successful",
      club,
    });
  } catch (error) {
    console.error("Club insertion failed", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}

export const handleUpdateClubDetail = async (req, res, next) => {
  try {
    const clubId = res.locals.validated.params.id;

    const clubExist = await prisma.club.findUnique({
      where: { id: clubId }
    });
    if (!clubExist) {
      return res.status(404).json({
        success: false,
        message: "Invalid club ID",
      })
    }

    const updateBody = clubUpdateFilter(req.body);

    const updatedClub = await prisma.club.update({
      where: { id: clubId },
      data: updateBody
    });

    return res.status(200).json({
      success: true,
      message: "Club details updated successful",
      updatedClub,
    })
  } catch (error) {
    console.error("Club updation failed", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}

export const handleDeletClubDetails = async (req, res, next) => {
  try {
    const clubId = res.locals.validated.params.id;

    const clubExist = await prisma.club.findUnique({
      where: { id: clubId }
    });
    if (!clubExist) {
      return res.status(404).json({
        success: false,
        message: "Invalid club ID",
      })
    }

    await prisma.club.delete({
      where: { id: clubId }
    });

    return res.status(200).json({
      success: true,
      message: "Club details deleted successfully"
    });
  } catch (error) {
    console.error("Club updation failed", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}

export const handleGetClubRequest = async (req, res) => {
  try {
    const clubId = res.locals.user.activeClubId;

    const requests = await prisma.clubJoinRequest.findMany({
      where: { clubId },
      include: {
        user: true, // 🔥 important for frontend
        club: true
      },
      orderBy: { createdAt: "desc" }
    });

    return handleResponse(res, 200, "Requests fetched", true, requests);

  } catch (error) {
    return handleResponse(res, 500, "Failed to fetch request", false);
  }
};

export const handleCreateClubRequest = async (req, res) => {
  try {
    const userId = res.locals.user.userId;
    const { clubId } = req.body;

    if (!clubId) {
      return handleResponse(res, 400, "Club ID required", false);
    }

    // ❌ already a member
    const membership = await prisma.userClubRole.findFirst({
      where: { userId, clubId }
    });

    if (membership) {
      return handleResponse(res, 400, "Already a member of this club", false);
    }

    // ❌ already requested
    const existingRequest = await prisma.clubJoinRequest.findUnique({
      where: {
        userId_clubId: {
          userId,
          clubId
        }
      }
    });

    if (existingRequest) {
      return handleResponse(res, 400, "Request already exists", false);
    }

    // ✅ create request
    const request = await prisma.clubJoinRequest.create({
      data: {
        userId,
        clubId,
        role: "CLUB_MEMBER"
      }
    });

    return handleResponse(res, 201, "Request sent successfully", true, request);

  } catch (error) {
    return handleResponse(res, 500, "Failed to create request", false);
  }
};

export const handleClubRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body; // action: APPROVE | REJECT
    const clubId = res.locals.user.activeClubId;
    const reviewerId = res.locals.user.userId;

    if (!requestId || !action) {
      return handleResponse(res, 400, "Request ID and action are required", false);
    }

    // // ✅ Step 1: Find request
    const clubRequest = await prisma.clubJoinRequest.findUnique({
      where: { id: requestId }
    });

    if (!clubRequest) {
      return handleResponse(res, 404, "Request not found", false);
    }

    // ✅ Step 2: Validate club
    if (clubRequest.clubId !== clubId) {
      return handleResponse(res, 403, "Unauthorized for this club", false);
    }

    // ✅ Step 3: Check status
    if (clubRequest.status !== "PENDING") {
      return handleResponse(res, 400, "Request already processed", false);
    }

    // ✅ Step 4: Update request
    const updatedRequest = await prisma.clubJoinRequest.update({
      where: { id: requestId },
      data: {
        status: action === "APPROVE" ? "APPROVED" : "REJECTED",
        reviewedById: reviewerId,
        reviewedAt: new Date()
      }
    });

    // ✅ Step 5: If approved → add to club
    if (action === "APPROVE") {
      await prisma.userClubRole.create({
        data: {
          userId: clubRequest.userId,
          clubId: clubRequest.clubId,
          role: clubRequest.role
        }
      });
    }

    return handleResponse(res, 200, `Request ${action.toLowerCase()}ed successfully`, true, updatedRequest);

  } catch (error) {
    console.log("Unable to approve/reject club request", error);
    return handleResponse(res, 500, "Something went wrong", false);
  }
};

export const handleDeleteClubRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = res.locals.user.userId;

    if (!requestId) {
      return handleResponse(res, 400, "Request ID is required", false);
    }

    // ✅ Step 1: Find request
    const clubRequest = await prisma.clubJoinRequest.findUnique({
      where: { id: requestId }
    });

    if (!clubRequest) {
      return handleResponse(res, 404, "Request not found", false);
    }

    // ✅ Step 2: Ownership check (VERY IMPORTANT)
    if (clubRequest.userId !== userId) {
      return handleResponse(res, 403, "You can only delete your own request", false);
    }

    // ✅ Step 3 (Optional but recommended): Only pending can be deleted
    if (clubRequest.status !== "PENDING") {
      return handleResponse(res, 400, "Only pending requests can be deleted", false);
    }

    // ✅ Step 4: Delete request
    await prisma.clubJoinRequest.delete({
      where: { id: requestId }
    });

    return handleResponse(res, 200, "Request cancelled successfully", true);

  } catch (error) {
    console.error("Delete own request failed", error);
    return handleResponse(res, 500, "Something went wrong", false);
  }
};

export const handleGetJoinedClub = async (req, res) => {
  try {
    const userId = res.locals.user.userId;

    const clubs = await prisma.userClubRole.findMany({
      where: { userId },
      include: { club: true }
    });

    const result = clubs.map((item) => ({
      id: item.club.id,
      name: item.club.name
    }));

    return handleResponse(res, 200, "Joined clubs fetched", true, result);

  } catch (error) {
    return handleResponse(res, 500, "Failed to fetch clubs", false);
  }
};

export const getAvailableClubs = async (req, res) => {
  try {
    const userId = res.locals.user.userId;

    // joined clubs
    const joined = await prisma.userClubRole.findMany({
      where: { userId },
      select: { clubId: true }
    });

    const joinedIds = joined.map(j => j.clubId);

    // requested clubs
    const requested = await prisma.clubJoinRequest.findMany({
      where: { userId },
      select: { clubId: true }
    });

    const requestedIds = requested.map(r => r.clubId);

    const clubs = await prisma.club.findMany({
      where: {
        id: { notIn: joinedIds }
      }
    });

    // ✅ mark requested clubs
    const result = clubs.map(club => ({
      id: club.id,
      name: club.name,
      alreadyRequested: requestedIds.includes(club.id)
    }));

    return handleResponse(res, 200, "Available clubs fetched", true, result);

  } catch (error) {
    return handleResponse(res, 500, "Failed to fetch available clubs", false);
  }
};

export const getRequestHistory = async (req, res) => {
  try {
    const userId = res.locals.user.userId;

    const requests = await prisma.clubJoinRequest.findMany({
      where: { userId },
      include: { club: true },
      orderBy: { createdAt: "desc" }
    });

    const result = requests.map((req) => ({
      club: req.club.name,
      status: req.status.toLowerCase()
    }));

    return handleResponse(res, 200, "History fetched", true, result);

  } catch (error) {
    return handleResponse(res, 500, "Failed to fetch history", false);
  }
};