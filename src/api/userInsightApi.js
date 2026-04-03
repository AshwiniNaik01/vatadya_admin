import axiosInstance from "../api/axiosInstance";

// ─────────────────────────────────────────────────────────────────────────────
//  HERO
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new hero section.
 * @param {Object} heroData - The hero section data.
 * @param {string} heroData.title - Hero title.
 * @param {string} heroData.description - Hero description.
 * @param {string} [heroData.heroImage] - URL or base64 of the hero image.
 * @param {string} [heroData.peaksClimbed] - Number of peaks climbed.
 * @param {string} [heroData.totalDistance] - Total distance covered.
 * @param {string} [heroData.avgAltitude] - Average altitude stat.
 * @param {string} [heroData.trekTime] - Average trek time.
 * @returns {Promise<Object>} - The created hero section from the server.
 */
export const createHero = async (heroData) => {
  try {
    const response = await axiosInstance.post("/hero", heroData);
    return response.data;
  } catch (error) {
    console.error("API Error (createHero):", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches the hero section.
 * @returns {Promise<Object>} - The hero section data from the server.
 */
export const getHero = async () => {
  try {
    const response = await axiosInstance.get("/hero");
    return response.data;
  } catch (error) {
    console.error("API Error (getHero):", error);
    throw error.response?.data || error;
  }
};

/**
 * Updates an existing hero section by ID.
 * @param {string} id - The hero section document ID.
 * @param {Object} heroData - The updated hero section data.
 * @returns {Promise<Object>} - The updated hero section from the server.
 */
export const updateHero = async (id, heroData) => {
  try {
    const response = await axiosInstance.put(`/hero/${id}`, heroData);
    return response.data;
  } catch (error) {
    console.error("API Error (updateHero):", error);
    throw error.response?.data || error;
  }
};

/**
 * Deletes a hero section by ID.
 * @param {string} id - The hero section document ID.
 * @returns {Promise<Object>} - The deletion confirmation from the server.
 */
export const deleteHero = async (id) => {
  try {
    const response = await axiosInstance.delete(`/hero/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error (deleteHero):", error);
    throw error.response?.data || error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  MISSION & VISION
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new mission & vision section.
 * @param {Object} data - The mission & vision data.
 * @param {string} data.title - Section title.
 * @param {string} [data.peaksConquered] - Number of peaks conquered stat.
 * @param {string} [data.expeditions] - Number of expeditions stat.
 * @param {string} [data.happyTrekkers] - Number of happy trekkers stat.
 * @param {string} [data.yearsOfGlory] - Years of glory stat.
 * @param {Array<{title: string, description: string}>} [data.missions] - List of mission items.
 * @returns {Promise<Object>} - The created mission & vision section from the server.
 */
export const createMissionVision = async (data) => {
  try {
    const response = await axiosInstance.post("/mission-vision", data);
    return response.data;
  } catch (error) {
    console.error("API Error (createMissionVision):", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches the mission & vision section.
 * @returns {Promise<Object>} - The mission & vision section data from the server.
 */
export const getMissionVision = async () => {
  try {
    const response = await axiosInstance.get("/mission-vision");
    return response.data;
  } catch (error) {
    console.error("API Error (getMissionVision):", error);
    throw error.response?.data || error;
  }
};

/**
 * Updates an existing mission & vision section by ID.
 * @param {string} id - The mission & vision document ID.
 * @param {Object} data - The updated mission & vision data.
 * @returns {Promise<Object>} - The updated mission & vision section from the server.
 */
export const updateMissionVision = async (id, data) => {
  try {
    const response = await axiosInstance.put(`/mission-vision/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("API Error (updateMissionVision):", error);
    throw error.response?.data || error;
  }
};

/**
 * Deletes a mission & vision section by ID.
 * @param {string} id - The mission & vision document ID.
 * @returns {Promise<Object>} - The deletion confirmation from the server.
 */
export const deleteMissionVision = async (id) => {
  try {
    const response = await axiosInstance.delete(`/mission-vision/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error (deleteMissionVision):", error);
    throw error.response?.data || error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  FAQs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new FAQ entry.
 * @param {Object} faqData - The FAQ data.
 * @param {string} faqData.category - The FAQ category (e.g. "pricing", "safety").
 * @param {string} faqData.question - The FAQ question.
 * @param {string} faqData.answer - The FAQ answer.
 * @returns {Promise<Object>} - The created FAQ entry from the server.
 */
export const createFaq = async (faqData) => {
  try {
    const response = await axiosInstance.post("/faqs", faqData);
    return response.data;
  } catch (error) {
    console.error("API Error (createFaq):", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches all FAQ entries, optionally filtered by category.
 * @param {string} [category] - Optional category filter (e.g. "pricing").
 * @returns {Promise<Array<Object>>} - The list of FAQ entries from the server.
 */
export const getFaqs = async (category) => {
  try {
    const params = category ? { category } : {};
    const response = await axiosInstance.get("/faqs", { params });
    return response.data;
  } catch (error) {
    console.error("API Error (getFaqs):", error);
    throw error.response?.data || error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  SAFETY STANDARDS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new safety standards section.
 * @param {Object} data - The safety standards data.
 * @param {string} data.title - Section title.
 * @param {string} [data.description] - Section description.
 * @param {Array<{title: string, description: string, image: string}>} [data.standards] - List of safety standard items.
 * @returns {Promise<Object>} - The created safety standards section from the server.
 */
export const createSafetyStandards = async (data) => {
  try {
    const response = await axiosInstance.post("/safety-standards", data);
    return response.data;
  } catch (error) {
    console.error("API Error (createSafetyStandards):", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches the safety standards section.
 * @returns {Promise<Object>} - The safety standards section data from the server.
 */
export const getSafetyStandards = async () => {
  try {
    const response = await axiosInstance.get("/safety-standards");
    return response.data;
  } catch (error) {
    console.error("API Error (getSafetyStandards):", error);
    throw error.response?.data || error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  HOW WE WORK
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new "How We Work" entry.
 * @param {Object} data - The how-we-work step data.
 * @param {string} data.title - Step title.
 * @param {string} data.description - Step description.
 * @returns {Promise<Object>} - The created how-we-work entry from the server.
 */
export const createHowWeWork = async (data) => {
  try {
    const response = await axiosInstance.post("/how-we-work", data);
    return response.data;
  } catch (error) {
    console.error("API Error (createHowWeWork):", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches all "How We Work" entries.
 * @returns {Promise<Array<Object>>} - The list of how-we-work entries from the server.
 */
export const getHowWeWork = async () => {
  try {
    const response = await axiosInstance.get("/how-we-work");
    return response.data;
  } catch (error) {
    console.error("API Error (getHowWeWork):", error);
    throw error.response?.data || error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  WHY CHOOSE US
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new "Why Choose Us" section.
 * @param {Object} data - The why-choose-us data.
 * @param {string} data.mainTitle - Section main title.
 * @param {string} [data.rating] - Rating stat value.
 * @param {string} [data.safety] - Safety stat value.
 * @param {string} [data.happyTrekkers] - Happy trekkers stat value.
 * @param {string} [data.expeditions] - Expeditions stat value.
 * @param {string} [data.image] - Section image URL or base64.
 * @param {Array<{title: string, description: string}>} [data.items] - List of feature items.
 * @returns {Promise<Object>} - The created why-choose-us section from the server.
 */
export const createWhyChooseUs = async (data) => {
  try {
    const response = await axiosInstance.post("/why-choose-us", data);
    return response.data;
  } catch (error) {
    console.error("API Error (createWhyChooseUs):", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches the "Why Choose Us" section.
 * @returns {Promise<Object>} - The why-choose-us section data from the server.
 */
export const getWhyChooseUs = async () => {
  try {
    const response = await axiosInstance.get("/why-choose-us");
    return response.data;
  } catch (error) {
    console.error("API Error (getWhyChooseUs):", error);
    throw error.response?.data || error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  FEATURES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new feature entry.
 * @param {Object} data - The feature data.
 * @param {string} data.title - Feature title.
 * @param {string} [data.description] - Feature description.
 * @param {string} [data.statValue] - Stat value (e.g. "99%").
 * @param {string} [data.statLabel] - Stat label (e.g. "Success Rate").
 * @param {string} [data.achievementMetric] - Additional achievement metric text.
 * @returns {Promise<Object>} - The created feature entry from the server.
 */
export const createFeature = async (data) => {
  try {
    const response = await axiosInstance.post("/our-features", data);
    return response.data;
  } catch (error) {
    console.error("API Error (createFeature):", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches all feature entries.
 * @returns {Promise<Array<Object>>} - The list of feature entries from the server.
 */
export const getFeatures = async () => {
  try {
    const response = await axiosInstance.get("/our-features");
    return response.data;
  } catch (error) {
    console.error("API Error (getFeatures):", error);
    throw error.response?.data || error;
  }
};

// ─────────────────────────────────────────────────────────────────────────────
//  FOOTER
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Creates a new footer section.
 * @param {Object} footerData - The footer section data.
 * @returns {Promise<Object>} - The created footer section from the server.
 */
export const createFooter = async (footerData) => {
  try {
    const response = await axiosInstance.post("/footer", footerData);
    return response.data;
  } catch (error) {
    console.error("API Error (createFooter):", error);
    throw error.response?.data || error;
  }
};

/**
 * Fetches the footer section.
 * @returns {Promise<Object>} - The footer section data from the server.
 */
export const getFooter = async () => {
  try {
    const response = await axiosInstance.get("/footer");
    return response.data;
  } catch (error) {
    console.error("API Error (getFooter):", error);
    throw error.response?.data || error;
  }
};

/**
 * Updates an existing footer section by ID.
 * @param {string} id - The footer section document ID.
 * @param {Object} footerData - The updated footer section data.
 * @param {Object} [footerData.brand] - Updated brand info block.
 * @param {Object} [footerData.socialLinks] - Updated social media URLs.
 * @param {Object} [footerData.contact] - Updated contact details block.
 * @param {Object} [footerData.footerBottom] - Updated footer bottom bar data.
 * @returns {Promise<Object>} - The updated footer section from the server.
 */
export const updateFooter = async (footerData) => {
  try {
    const response = await axiosInstance.put("/footer", footerData);
    return response.data;
  } catch (error) {
    console.error("API Error (updateFooter):", error);
    throw error.response?.data || error;
  }
};

/**
 * Deletes a footer section by ID.
 * @param {string} id - The footer section document ID.
 * @returns {Promise<Object>} - The deletion confirmation from the server.
 */
export const deleteFooter = async (id) => {
  try {
    const response = await axiosInstance.delete(`/footer/${id}`);
    return response.data;
  } catch (error) {
    console.error("API Error (deleteFooter):", error);
    throw error.response?.data || error;
  }
};
