import { useEffect } from "react";

export default function Reminder({ activities }) {
  useEffect(() => {
    const now = new Date();
    if (now.getHours() >= 18) {
      const hasWalk = activities.some(a => a.type === "walk");
      if (!hasWalk) {
        alert("⚠️ Reminder: Rex still needs exercise today!");
      }
    }
  }, [activities]);

  return null;
}
