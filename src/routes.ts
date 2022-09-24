import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { hourStringToMinutes } from "./utils/hourStringToMinutes";
import { minutesToHourString } from "./utils/minutesToHourString";

const routes = Router();
const prisma = new PrismaClient();

routes.get("/games", async (req, res) => {
  const games = await prisma.game.findMany({
    include: {
      _count: {
        select: {
          ads: true,
        },
      },
    },
  });
  return res.status(200).json(games);
});

routes.post("/games/:game_id/ad", async (req, res) => {
  const gameId = req.params.game_id;

  const body = req.body;

  const ad = await prisma.ad.create({
    data: {
      gameId,
      name: body.name,
      hoursStart: hourStringToMinutes(body.hourStart),
      hoursEnd: hourStringToMinutes(body.hourEnd),
      discord: body.discord,
      useVoiceChannel: body.useVoiceChannel,
      weekDays: body.weekDays.join(","),
      yearsPlaying: body.yearsPlaying,
    },
  });

  return res.status(201).json({
    ...ad,
    hoursStart: minutesToHourString(ad.hoursStart),
    hoursEnd: minutesToHourString(ad.hoursEnd),
  });
});

routes.get("/games/:game_id/ads", async (req, res) => {
  const gameId = req.params.game_id;

  const ads = await prisma.ad.findMany({
    select: {
      id: true,
      name: true,
      gameId: true,
      game: true,
      hoursStart: true,
      hoursEnd: true,
      weekDays: true,
      yearsPlaying: true,
      useVoiceChannel: true,
    },
    where: {
      gameId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return res.status(200).json(
    ads.map((ad) => {
      return {
        ...ad,
        weekDays: ad.weekDays.split(","),
        hoursStart: minutesToHourString(ad.hoursStart),
        hoursEnd: minutesToHourString(ad.hoursEnd),
      };
    })
  );
});

routes.get("/ads/:ad_id/discord", async (req, res) => {
  const adId = req.params.ad_id;

  const discord = await prisma.ad.findUnique({
    select: {
      discord: true,
    },
    where: {
      id: adId,
    },
  });

  return res.status(200).json(discord);
});

export default routes;
