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
    const clubId = res.locals.user.activeClubId

    const requestDetails = await prisma.clubJoinRequest.findFirst({
        where: { clubId }
    })
    return res.status(200).json({
      success: true,
      message: "Club details fetchedd successfully",
      requestDetails
    });
  } catch (error) {
    console.error("Failed to fetch request", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}

export const handleCreateClubRequest = async (req, res) => {
  try {
    const { clubId, role } = req.body;
    const userId = res.locals.user.userId;

    const existingRequest = await prisma.clubJoinRequest.findFirst({
      where: { userId, clubId, status: "PENDING" }
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: "Club request already exist, try again later",
      })
    }

    const request = await prisma.clubJoinRequest.create({
      data: { userId, clubId, role }
    })

    handleResponse(res, 200, "club request created seccussfully", true);
  } catch (error) {
    console.error("Club request failed", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}

export const handleClubRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body; // action: APPROVE | REJECT
    const clubId = res.locals.user.activeClubId;
    const reviewerId = res.locals.user.userId;

    if (!requestId || !action) {
      return handleResponse(res, 400, "Request ID and action are required", false);
    }

    // ✅ Step 1: Find request
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

    const roles = await prisma.userClubRole.findMany({
      where: { userId },
      include: { club: true }
    });

    return handleResponse(res, 200, "User fetched successfully", true, roles);
  } catch (error) {
    console.error("Unable to make db query", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong. Please try again later.",
    });
  }
}