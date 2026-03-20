const natural = require('natural');
const { TfIdf, LevenshteinDistance } = natural;

/**
 * Calculates similarity between a new item and existing items of the opposite type.
 * Uses a multi-layered approach: TF-IDF, Levenshtein, Category weight, and Time Decay.
 */
const findMatches = (newItem, existingItems) => {
    if (!existingItems || existingItems.length === 0) return [];

    const tfidf = new TfIdf();
    
    // Add all existing items as documents for TF-IDF
    existingItems.forEach(item => {
        tfidf.addDocument(`${item.title} ${item.description}`.toLowerCase());
    });

    const matches = existingItems.map((item, index) => {
        let score = 0;

        // 1. TF-IDF Similarity (Text Depth)
        // We calculate how significant the new item's terms are in the existing items' corpus
        const newTerms = `${newItem.title} ${newItem.description}`.toLowerCase().split(/\W+/);
        let tfidfScore = 0;
        newTerms.forEach(term => {
            tfidf.tfidfs(term, (i, measure) => {
                if (i === index) tfidfScore += measure;
            });
        });
        
        // Normalize TF-IDF (approximate weight 40%)
        score += Math.min(tfidfScore * 10, 40);

        // 2. Levenshtein Distance (Fuzzy Keyword Matching - 20%)
        // Handling typos in titles (e.g., "hpndphones" vs "headphones")
        const levDist = LevenshteinDistance(newItem.title.toLowerCase(), item.title.toLowerCase());
        const maxLen = Math.max(newItem.title.length, item.title.length);
        const levSimilarity = maxLen === 0 ? 1 : 1 - (levDist / maxLen);
        score += (levSimilarity * 20);

        // 3. Category Match (Categorical Boost - 20%)
        if (newItem.category === item.category) {
            score += 20;
        } else {
            score -= 10; // Penalty for wrong category
        }

        // 4. Location & Metadata (10%)
        const locSimilarity = LevenshteinDistance(newItem.location.toLowerCase(), item.location.toLowerCase());
        const locMaxLen = Math.max(newItem.location.length, item.location.length);
        const locMatch = locMaxLen === 0 ? 1 : 1 - (locSimilarity / locMaxLen);
        score += (locMatch * 10);

        // 5. Time Decay (Temporal Proximity - 10%)
        const dayDiff = Math.abs(new Date(newItem.date) - new Date(item.date)) / (1000 * 60 * 60 * 24);
        // Exponential decay or linear drop
        const timeFactor = Math.max(0, 1 - (dayDiff / 30)); // 0 after 30 days
        score += (timeFactor * 10);

        return {
            item,
            score: Math.max(0, Math.min(score, 100)),
            aiExplanation: {
                textMatch: Math.round(tfidfScore * 10),
                fuzzyMatch: Math.round(levSimilarity * 100),
                categoryMatch: newItem.category === item.category
            }
        };
    });

    // Return matches above 15% threshold, sorted by score
    return matches
        .filter(m => m.score >= 15)
        .sort((a, b) => b.score - a.score);
};

module.exports = { findMatches };
