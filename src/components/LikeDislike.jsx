import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";


const LikeDislike = () => {
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [userReaction, setUserReaction] = useState(0);
  const [isClickable, setIsClickable] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  // ✅ Load previous reactions from local storage on mount
  useEffect(() => {
    const savedReaction = localStorage.getItem("userReaction");
    if (savedReaction) {
      try {
        const reactionData = JSON.parse(savedReaction);
        setLikeCount(reactionData.likeCount ?? 0);
        setDislikeCount(reactionData.dislikeCount ?? 0);
        setUserReaction(reactionData.userReaction ?? 0);
        setIsLoaded(true);
      } catch (error) {
        console.error("Error parsing localStorage data:", error);
        localStorage.removeItem("userReaction");
      }
    } else {
      setIsLoaded(true);
    }
  }, []);

  // ✅ Save reactions to local storage only when data changes
  useEffect(() => {
    if (isLoaded) {
      const reactionData = { likeCount, dislikeCount, userReaction };
      localStorage.setItem("userReaction", JSON.stringify(reactionData));
    }
  }, [likeCount, dislikeCount, userReaction, isLoaded]);

  // ✅ Handle Like/Dislike Clicks with delay prevention
  const handleClick = (reactionType) => {
    if (!isClickable) return;
    setIsClickable(false);
    setTimeout(() => setIsClickable(true), 500); // 500ms delay

    if (reactionType === "like") {
      if (userReaction === 1) {
        setLikeCount((prev) => prev - 1);
        setUserReaction(0);
      } else {
        setLikeCount((prev) => prev + 1);
        if (userReaction === -1) setDislikeCount((prev) => prev - 1);
        setUserReaction(1);
      }
    } else {
      if (userReaction === -1) {
        setDislikeCount((prev) => prev - 1);
        setUserReaction(0);
      } else {
        setDislikeCount((prev) => prev + 1);
        if (userReaction === 1) setLikeCount((prev) => prev - 1);
        setUserReaction(-1);
      }
    }
  };

  return (
    <div className="app-container">
      <div className="post-card">
        <div className="post-text">🚀 This is an amazing React tutorial! 🎉</div>
        
        {/* Buttons */}
        <div className="button-container">
          <button
            className={`like-btn ${userReaction === 1 ? "active" : ""}`}
            onClick={() => handleClick("like")}
          >
            👍 
            <motion.span
              key={likeCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {likeCount}
            </motion.span>
          </button>
          <button
            className={`dislike-btn ${userReaction === -1 ? "active" : ""}`}
            onClick={() => handleClick("dislike")}
          >
            👎 
            <motion.span
              key={dislikeCount}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.2 }}
            >
              {dislikeCount}
            </motion.span>
          </button>
        </div>

        {/* ✅ Animated Reaction Message */}
        {userReaction !== 0 && (
          <motion.div
            className="reaction-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {userReaction === 1 ? (
              <p className="liked">✅ You liked this post! Thanks for the support! 💚</p>
            ) : (
              <p className="disliked">❌ You disliked this post! Let us improve. 😞</p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default LikeDislike;
