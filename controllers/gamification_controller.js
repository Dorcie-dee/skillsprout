// import { Types } from 'mongoose';
import mongoose from 'mongoose';
import { CourseModel } from '../models/course_model.js';
import { GameModel } from '../models/gamification_model.js';

//XP (Experience Points)
//Badges earned
//Current level
//Streak count (for daily/weekly learning)
//Achievements
//Lesson/activity progress


export const completeLesson = async (req, res) => {
  try {
    const userId = req.auth.id;
    const { lessonId } = req.body;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(lessonId)) {
      return res.status(400).json({ message: "Invalid lesson ID" });
    }

    const lesson = await CourseModel.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: 'Lesson not found' });
    }

    let gamify = await GameModel.findOne({ userId });

    // Initialize gamification profile if it doesn't exist
    if (!gamify) {
      gamify = await GameModel.create({ userId });
    }

    const today = new Date().toDateString();
    const lastActive = gamify.streak.lastActiveDate?.toDateString();
    let streakCount = gamify.streak.count || 0;

    // Handle streak update
    if (lastActive !== today) {
      streakCount = (lastActive === new Date(Date.now() - 86400000).toDateString())
        ? streakCount + 1
        : 1;
    }

    const xpGained = 20;

    // Track lesson unlock
    const alreadyUnlocked = gamify.unlockedLessons.some(
      (id) => id.toString() === lessonId
    );

    if (!alreadyUnlocked) {
      gamify.unlockedLessons.push(lessonId);
      gamify.xp += xpGained;
    }

    // Streak update
    gamify.streak = {
      count: streakCount,
      lastActiveDate: new Date()
    };

    const totalLessons = gamify.unlockedLessons.length;
    const newBadges = [];
    const newAchievements = [];

    // Add badges
    const addBadge = (name, description, iconUrl) => {
      const hasBadge = gamify.badges.some((b) => b.name === name);
      if (!hasBadge) {
        gamify.badges.push({ name, description, iconUrl });
        newBadges.push({ name, description });
      }
    };

    if (totalLessons === 5) {
      addBadge("5-Lesson Champ", "Completed 5 lessons",) //"LINK TO A MEDAL ICON");
    }

    if (totalLessons === 10) {
      addBadge("10-Lesson Master", "Completed 10 lessons",) //"LINK TO A MEDAL ICON");
    }

    // Add achievement for 3-day streak
    if (streakCount === 3) {
      const hasAchievement = gamify.achievements.some(
        (a) => a.title === "3-Day Streak Hero"
      );
      if (!hasAchievement) {
        gamify.achievements.push({
          title: "3-Day Streak Hero",
          description: "Completed lessons 3 days in a row"
        });
        newAchievements.push({
          title: "3-Day Streak Hero",
          description: "Completed lessons 3 days in a row"
        });
      }
    }

    await gamify.save();

    res.status(200).json({
      message: 'Lesson completed!',
      xpGained: alreadyUnlocked ? 0 : xpGained,
      newStreak: streakCount,
      newBadges,
      newAchievements
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};























// export const completeLesson = async (req, res) => {
//   try {
//     const userId = req.auth.id;
//     const { lessonId } = req.body;

//     if (!Types.ObjectId.isValid(lessonId)) {
//       return res.status(400).json({ message: 'Invalid lesson ID' });
//     }

    // checking if lesson exists (optional)
    // const lesson = await CourseModel.findById(lessonId);
    // if (!lesson) {
    //   return res.status(404).json({ message: 'Lesson not found' });
    // }

    // XP and streak update
    // const gamify = await GameModel.findOne({ userId });

    // const today = new Date().toDateString();
    // const lastActive = gamify?.streak?.lastActiveDate?.toDateString();

    // let streakCount = gamify?.streak?.count || 0;

    // if (lastActive === today) {
      // Already logged today, do nothing to streak
    // } else if (
    //   lastActive === new Date(Date.now() - 86400000).toDateString() // yesterday
    // ) {
    //   streakCount++;
    // } else {
    //   streakCount = 1;
    // }

    // XP to gain
    //const xpGained = 20;

    // Update gamification data
    // await GameModel.findOneAndUpdate(
    //   { userId },
    //   {
    //     $inc: { xp: xpGained },
    //     $set: { 'streak.count': streakCount, 'streak.lastActiveDate': new Date() },
    //     $addToSet: { unlockedLessons: lessonId }
    //   },
    //   { upsert: true, new: true }
    // );

    // return res.status(200).json({
    //   message: 'Lesson completed!',
    //   xpGained,
    //   newStreak: streakCount,
    // });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };
