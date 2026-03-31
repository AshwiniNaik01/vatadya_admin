// ========================= usePassword.js =================================
// Custom hook for password field management + auto-generation

import { useState } from "react";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$!";

export const usePassword = (initial = "") => {
  const [password, setPassword] = useState(initial);

  const generate = (length = 8) => {
    let result = "";
    for (let i = 0; i < length; i++) {
      result += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    }
    setPassword(result);
    return result;
  };

  return { password, setPassword, generate };
};
